import { Connection, Signal } from "@rbxts/beacon";
import { Document, createCollection } from "@rbxts/lapis";
import Maid from "@rbxts/maid";
import { Players } from "@rbxts/services";
import { t } from "@rbxts/t";
import dataConfig from "shared/config/dataConfig";
import network from "shared/network/network";
import reconcileMigration from "shared/reflex/migrations/reconcileMigration";
import {
	saveExceptions as profileSaveExceptions,
	CreateProducer as createProfileProducer,
	defaultState as defaultProfileState,
	State as profileState,
	replicationExceptions as profileReplicationExceptions,
} from "shared/reflex/serverProfile";
import {
	defaultState as defaultServerState,
	CreateProducer as createServerProducer,
	saveExceptions as serverSaveExceptions,
	State as serverProdState,
	replicationExceptions as serverReplicationExceptions,
} from "shared/reflex/serverState";
import serverSignals from "shared/signal/serverSignals";
import { ServerPlayerProfile, ServerState } from "shared/types/StateTypes";

const profilesCollection = createCollection("playerProfiles", {
	defaultData: defaultProfileState,
	migrations: [
		(data) => {
			return reconcileMigration<profileState>(data as Partial<profileState>, defaultProfileState);
		},
	],
	validate: t.any,
});

const stateCollection = createCollection("serverStates", {
	defaultData: defaultServerState,
	migrations: [
		(data) => {
			return reconcileMigration<serverProdState>(data as Partial<serverProdState>, defaultServerState);
		},
	],
	validate: t.any,
});

const playerDataLoadedEvent: Signal<[Player, ServerPlayerProfile]> = new Signal();
const serverDataLoadedEvent: Signal<[ServerState]> = new Signal();

let playerProfiles: { [playerName: string]: ServerPlayerProfile | undefined } = {};
export let serverState: ServerState | undefined;

export const getPlayerProfile = (player: Player): ServerPlayerProfile | undefined => {
	return playerProfiles[player.Name];
};

export const waitForPlayerProfile = (player: Player): Promise<ServerPlayerProfile> => {
	return new Promise((resolve) => {
		if (playerProfiles[player.Name]) {
			resolve(playerProfiles[player.Name] as ServerPlayerProfile);
			return;
		}

		let connection: Connection<[Player, ServerPlayerProfile]> | undefined;
		connection = playerDataLoadedEvent.Connect((loadedPlayer: Player, profile: ServerPlayerProfile) => {
			if (loadedPlayer !== player) return;

			resolve(profile);
			connection!.Disconnect();
			connection = undefined;
		});
	});
};

export const waitForServerState = (): Promise<ServerState> => {
	return new Promise((resolve) => {
		if (serverState) {
			resolve(serverState as ServerState);
			return;
		}

		serverDataLoadedEvent.Once((loadedServerState: ServerState) => {
			resolve(loadedServerState);
		});
	});
};

const getDataToSave = <scopedState>(
	state: scopedState,
	saveExceptions: typeof profileSaveExceptions | typeof serverSaveExceptions,
): scopedState => {
	const newState = { ...state } as { [key: string]: unknown };

	saveExceptions.forEach((exception: string) => {
		newState[exception] = undefined;
	});

	return newState as unknown as scopedState;
};

const serverData: InitializerFunction = () => {
	const maid = new Maid();
	serverState = undefined;
	playerProfiles = {};

	stateCollection
		.load(dataConfig.serverStateKey)
		.andThen((document) => {
			const correctDocumentType = document as unknown as Document<serverProdState>;

			const producer = createServerProducer(correctDocumentType.read());

			const state: ServerState = {
				producer: producer,
				subscription: producer.subscribe(
					(state) => {
						return state;
					},
					(newValue) => {
						state.document.write(getDataToSave(newValue, serverSaveExceptions));
					},
				),
				document: correctDocumentType,
			};

			const replicateMiddleware = () => {
				return (dispatch: (...args: unknown[]) => unknown, name: string) =>
					(...args: unknown[]) => {
						if (state.changedBy) {
							network.GetReplicatedState.fireAllExcept(state.changedBy, {
								name: name,
								arguments: args,
							});
							state.changedBy = undefined;
							return dispatch(...args);
						}

						if (serverReplicationExceptions.find((value: string) => value === name)) {
							return dispatch(...args);
						}

						network.GetReplicatedState.fireAll({
							name: name,
							arguments: args,
						});

						return dispatch(...args);
					};
			};

			state.producer.applyMiddleware(replicateMiddleware);
			serverState = state;
			serverDataLoadedEvent.Fire(serverState);
		})
		.catch((err: string) => {
			warn(`FATAL DATA ERROR! Server state has failed to load, kicking players!\n`, err);

			Players.GetPlayers().forEach((player: Player) => {
				player.Kick(`FATAL DATA ERROR! Server state has failed to load, report this to the developers`);
			});
		});

	maid.GiveTask(
		serverSignals.playerAdded.Connect((player: Player) => {
			profilesCollection
				.load(`playerProfile_${player.UserId}_${dataConfig.playerProfileKey}`, [player.UserId])
				.andThen((document) => {
					const correctDocumentType = document as unknown as Document<profileState>;

					if (!player.Parent) {
						document.close().catch(warn);
					} else {
						const producer = createProfileProducer(correctDocumentType.read());

						const profile: ServerPlayerProfile = {
							player: player,
							document: correctDocumentType,
							subscription: producer.subscribe(
								(state) => {
									return state;
								},
								(newState) => {
									profile.document.write(getDataToSave(newState, profileSaveExceptions));
								},
							),
							producer: producer,
							nextActionIsReplicated: false,
						};

						const replicateMiddleware = () => {
							return (dispatch: (...args: unknown[]) => unknown, name: string) =>
								(...args: unknown[]) => {
									if (profile.nextActionIsReplicated) {
										profile.nextActionIsReplicated = false;
										return dispatch(...args);
									}

									if (profileReplicationExceptions.find((value: string) => value === name)) {
										return dispatch(...args);
									}

									network.GetReplicatedProfile.fire(player, {
										name: name,
										arguments: args,
									});

									return dispatch(...args);
								};
						};

						profile.producer.applyMiddleware(replicateMiddleware);
						playerProfiles[player.Name] = profile;
						playerDataLoadedEvent.Fire(player, profile);
					}
				})
				.catch((err: string) => {
					warn(`Player ${player.Name}s data failed to load: ${err}`);
					player.Kick(`Fatal data error, report this to the developers`);
				});
		}),
	);

	maid.GiveTask(
		serverSignals.playerRemoving.Connect((player: Player) => {
			const profile = playerProfiles[player.Name];

			if (profile) {
				profile.document.close().catch(warn);
				profile.subscription();
				playerProfiles[player.Name] = undefined;
			}
		}),
	);

	network.GetPlayerData.onRequest((player: Player) => {
		const profile = getPlayerProfile(player);
		if (profile === undefined) {
			return;
		}

		return profile.producer.getState();
	});

	network.GetServerData.onRequest((player: Player) => {
		if (serverState === undefined) return;

		return serverState.producer.getState();
	});

	maid.GiveTask(
		network.ReplicateProfile.connect((player, data) => {
			const [isSecureAction] = data.name.find("^secure");
			if (isSecureAction !== undefined) {
				warn(`Player tried to replicate secure reflex action ${data.name}`);
				return;
			}

			const profile = getPlayerProfile(player);
			if (!profile) return;

			profile.nextActionIsReplicated = true;
			(profile.producer as unknown as withCallSignature)[data.name](...data.arguments);
		}),
	);

	maid.GiveTask(
		network.ReplicateState.connect((player, data) => {
			const [isSecureAction] = data.name.find("^secure");
			if (isSecureAction !== undefined) {
				warn(`Player tried to replicate secure reflex action ${data.name}`);
				return;
			}

			if (!serverState) return;

			serverState.changedBy = player;
			(serverState.producer as unknown as withCallSignature)[data.name](...data.arguments);
		}),
	);

	return () => {
		maid.DoCleaning();
	};
};

export default serverData;
