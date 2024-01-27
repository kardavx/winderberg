import { Connection, Signal } from "@rbxts/beacon";
import { createCollection } from "@rbxts/lapis";
import Maid from "@rbxts/maid";
import { Players } from "@rbxts/services";
import { t } from "@rbxts/t";
import dataConfig from "shared/config/dataConfig";
import network from "shared/network/network";
import {
	saveExceptions as profileSaveExceptions,
	CreateProducer as createProfileProducer,
	defaultState as defaultProfileState,
	runtimeStateValidation as profileRuntimeStateValidation,
	State as profileState,
} from "shared/reflex/serverProfile";
import {
	defaultState as defaultServerState,
	runtimeStateValidation as serverRuntimeStateValidation,
	CreateProducer as createServerProducer,
	saveExceptions as serverSaveExceptions,
} from "shared/reflex/serverState";
import serverSignals from "shared/signal/serverSignals";
import { ServerPlayerProfile, ServerState } from "shared/types/StateTypes";

const profilesCollection = createCollection("playerProfiles", {
	defaultData: defaultProfileState,
	validate: t.strictInterface(profileRuntimeStateValidation),
});

const stateCollection = createCollection("serverStates", {
	defaultData: defaultServerState,
	validate: t.strictInterface(serverRuntimeStateValidation),
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

const getDataToSave = (state: profileState, saveExceptions: typeof profileSaveExceptions): Partial<profileState> => {
	const newState: { [key: string]: unknown } = { ...state };

	saveExceptions.forEach((exception: string) => {
		newState[exception] = undefined;
	});

	return newState;
};

const serverData: InitializerFunction = () => {
	const maid = new Maid();
	serverState = undefined;
	playerProfiles = {};

	stateCollection
		.load(dataConfig.serverStateKey)
		.andThen((document) => {
			const state = {
				producer: createServerProducer(document),
				document: document,
				nextActionIsReplicated: false,
			};

			const replicateMiddleware = () => {
				return (dispatch: (...args: unknown[]) => unknown, name: string) =>
					(...args: unknown[]) => {
						if (state.nextActionIsReplicated) {
							state.nextActionIsReplicated = false;
							return dispatch(args);
						}

						network.GetReplicatedState.fireAll({
							name: name,
							arguments: args,
						});

						return dispatch(args);
					};
			};

			state.producer.applyMiddleware(replicateMiddleware);
			serverState = state;
			serverDataLoadedEvent.Fire(serverState);
		})
		.catch((err: string) => {
			warn(`FATAL DATA ERROR! Server state has failed to load, kicking players!`);

			Players.GetPlayers().forEach((player: Player) => {
				player.Kick(`FATAL DATA ERROR! Server state has failed to load, report this to the developers`);
			});

			error(err);
		});

	maid.GiveTask(
		serverSignals.playerAdded.Connect((player: Player) => {
			profilesCollection
				.load(`playerProfile_${player.UserId}_${dataConfig.playerProfileKey}`, [player.UserId])
				.andThen((document) => {
					if (!player.Parent) {
						document.close().catch(warn);
					} else {
						const profile: ServerPlayerProfile = {
							player: player,
							document: document,
							producer: createProfileProducer(document),
							nextActionIsReplicated: false,
						};

						const replicateMiddleware = () => {
							return (dispatch: (...args: unknown[]) => unknown, name: string) =>
								(...args: unknown[]) => {
									if (profile.nextActionIsReplicated) {
										profile.nextActionIsReplicated = false;
										return dispatch(args);
									}

									network.GetReplicatedProfile.fire(player, {
										name: name,
										arguments: args,
									});

									return dispatch(args);
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
				profile.document.write(getDataToSave(profile.producer.getState(), profileSaveExceptions));
				profile.document.close().catch(warn);
				playerProfiles[player.Name] = undefined;
			}
		}),
	);

	maid.GiveTask(
		serverSignals.onClosing.Connect(() => {
			if (serverState) {
				serverState.document.write(getDataToSave(serverState.producer.getState(), serverSaveExceptions));
				serverState.document.close().catch(warn);
				serverState = undefined;
			}
		}),
	);

	network.GetPlayerData.onRequest((player: Player) => {
		const profile = getPlayerProfile(player);
		if (!profile) {
			return;
		}

		return profile.producer.getState();
	});

	network.GetServerData.onRequest((player: Player) => {
		if (!serverState) return;

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

			serverState.nextActionIsReplicated = true;
			(serverState.producer as unknown as withCallSignature)[data.name](...data.arguments);
		}),
	);

	return () => {
		maid.DoCleaning();
	};
};

export default serverData;
