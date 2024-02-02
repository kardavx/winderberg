import Maid from "@rbxts/maid";
import network from "shared/network/network";
import gameSignals from "shared/signal/clientSignals";

import { CreateProducer as CreateClientProducer, defaultState, ClientProducer } from "shared/reflex/clientState";

import {
	CreateProducer as CreateProfileProducer,
	ProfileProducer,
	State as profileState,
	replicationExceptions as profileReplicationExceptions,
} from "shared/reflex/serverProfile";

import {
	CreateProducer as CreateServerProducer,
	ServerProducer,
	State as serverProdState,
	replicationExceptions as serverReplicationExceptions,
} from "shared/reflex/serverState";

export let clientProducer: ClientProducer = CreateClientProducer(defaultState);
export let serverProfile: ProfileProducer | undefined;
export let serverState: ServerProducer | undefined;

export let isPlayerDataLoaded: boolean = false;
export let isServerDataLoaded: boolean = false;

let nextProfileActionIsReplicated = false;
let nextStateActionIsReplicated = false;

const profileReplicationQueue: (() => void)[] = [];
const stateReplicationQueue: (() => void)[] = [];

export const getServerProfile = () => {
	return serverProfile;
};

export const getServerState = () => {
	return serverState;
};

const replicateProfileMiddleware = () => {
	return (dispatch: (...args: unknown[]) => unknown, name: string) =>
		(...args: unknown[]) => {
			if (nextProfileActionIsReplicated) {
				nextProfileActionIsReplicated = false;

				if (profileReplicationQueue.size() > 0) {
					profileReplicationQueue.remove(0)!();
				}

				return dispatch(...args);
			}

			const [isSecureAction] = name.find("^secure");
			if (profileReplicationExceptions.find((value: string) => value === name) || isSecureAction !== undefined) {
				return dispatch(...args);
			}

			network.ReplicateProfile.fire({
				name: name,
				arguments: args,
			});

			return dispatch(...args);
		};
};

const replicateStateMiddleware = () => {
	return (dispatch: (...args: unknown[]) => unknown, name: string) =>
		(...args: unknown[]) => {
			if (nextStateActionIsReplicated) {
				nextStateActionIsReplicated = false;

				if (stateReplicationQueue.size() > 0) {
					stateReplicationQueue.remove(0)!();
				}

				return dispatch(...args);
			}

			const [isSecureAction] = name.find("^secure");
			if (serverReplicationExceptions.find((value: string) => value === name) || isSecureAction !== undefined) {
				return dispatch(...args);
			}

			network.ReplicateState.fire({
				name: name,
				arguments: args,
			});

			return dispatch(...args);
		};
};

const loadProfileData = Promise.retryWithDelay(
	() => {
		return new Promise((resolve, reject) => {
			const playerData = network.GetPlayerData.request();

			playerData
				.andThen((data) => {
					if (data === undefined) {
						reject("No data");
						return;
					}

					resolve(data);
				})
				.catch((err: string) => {
					reject(err);
				});
		});
	},
	math.huge,
	0.25,
);

const loadServerData = Promise.retryWithDelay(
	() => {
		return new Promise((resolve, reject) => {
			const playerData = network.GetServerData.request();

			playerData
				.andThen((data) => {
					if (data === undefined) {
						reject("No data");
						return;
					}

					resolve(data);
				})
				.catch((err: string) => {
					reject(err);
				});
		});
	},
	math.huge,
	0.25,
);

const loadProfile = (): Promise<ProfileProducer> => {
	return new Promise((resolve) => {
		loadProfileData.andThen((serverPlayerData) => {
			const serverProfileProducer = CreateProfileProducer(serverPlayerData as profileState);
			serverProfileProducer.applyMiddleware(replicateProfileMiddleware);

			resolve(serverProfileProducer);
		});
	});
};

const loadServerState = (): Promise<ServerProducer> => {
	return new Promise((resolve) => {
		loadServerData.andThen((serverData) => {
			const serverProducer = CreateServerProducer(serverData as serverProdState);
			serverProducer.applyMiddleware(replicateStateMiddleware);

			resolve(serverProducer);
		});
	});
};

const clientPlayerData: InitializerFunction = () => {
	const maid = new Maid();

	clientProducer = CreateClientProducer(defaultState);
	serverProfile = undefined;
	serverState = undefined;

	nextProfileActionIsReplicated = false;
	nextStateActionIsReplicated = false;
	isServerDataLoaded = false;
	isPlayerDataLoaded = false;

	loadProfile().andThen((serverProfileProducer) => {
		serverProfile = serverProfileProducer;
		isPlayerDataLoaded = true;
		gameSignals.playerDataLoaded.Fire();
	});

	loadServerState().andThen((serverStateProducer) => {
		serverState = serverStateProducer;
		isServerDataLoaded = true;
		gameSignals.serverDataLoaded.Fire();
	});

	maid.GiveTask(
		network.GetReplicatedProfile.connect((data) => {
			print("on profile repliation");
			if (!isPlayerDataLoaded) {
				warn("Queued profile action before player data loaded");
				gameSignals.playerDataLoaded.Wait();
			}

			if (nextProfileActionIsReplicated) {
				profileReplicationQueue.push(() => {
					nextProfileActionIsReplicated = true;
					const actualProfile = serverProfile as unknown as withCallSignature;
					actualProfile[data.name](...data.arguments);
				});
			} else {
				nextProfileActionIsReplicated = true;
				const actualProfile = serverProfile as unknown as withCallSignature;
				actualProfile[data.name](...data.arguments);
			}
		}),
	);

	maid.GiveTask(
		network.GetReplicatedState.connect((data) => {
			print(`[STATE REPLICATION] ${data.name} with arguments`, data.arguments);
			if (!isServerDataLoaded) {
				warn("Queued store action before server data loaded");
				return;
			}

			if (nextStateActionIsReplicated) {
				stateReplicationQueue.push(() => {
					nextStateActionIsReplicated = true;

					const actualProfile = serverState as unknown as withCallSignature;
					actualProfile[data.name](...data.arguments);
				});
			} else {
				nextStateActionIsReplicated = true;

				const actualProfile = serverState as unknown as withCallSignature;
				actualProfile[data.name](...data.arguments);
			}
		}),
	);

	maid.GiveTask(() => {
		serverProfile = undefined;
		nextProfileActionIsReplicated = false;
		nextStateActionIsReplicated = false;
		isServerDataLoaded = false;
		isPlayerDataLoaded = false;
	});

	return () => {
		maid.DoCleaning();
	};
};

export default clientPlayerData;
