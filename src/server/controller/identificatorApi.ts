import Maid from "@rbxts/maid";
import { Players } from "@rbxts/services";
import serverSignals from "shared/signal/serverSignals";
import { waitForPlayerProfile } from "./serverData";

const registeredPlayers: string[] = [];

export const getPlayerObjectFromId = (id: number): Player | undefined => {
	const playerName = registeredPlayers[id];
	if (playerName === undefined) return;

	return Players.FindFirstChild(playerName) as Player | undefined;
};

export const getPlayerNameFromId = (id: number): string | undefined => {
	return registeredPlayers[id] as string | undefined;
};

export const getIdFromPlayerObject = (player: Player): number | undefined => {
	let playerId: number | undefined = undefined;

	registeredPlayers.forEach((registeredPlayerName: string, id: number) => {
		if (registeredPlayerName === player.Name) playerId = id;
	});

	return playerId;
};

const identificatorApi: InitializerFunction = () => {
	const maid = new Maid();

	maid.GiveTask(
		serverSignals.playerAdded.Connect((player: Player) => {
			waitForPlayerProfile(player).andThen((profile) => {
				const lastId = getIdFromPlayerObject(player);
				if (lastId !== undefined) {
					profile.producer.secureAssignId(lastId);
				} else {
					const id = registeredPlayers.push(player.Name);
					profile.producer.secureAssignId(id - 1);
				}
			});
		}),
	);

	maid.GiveTask(() => {
		registeredPlayers.forEach((_, id: number) => delete registeredPlayers[id]);
	});

	return () => maid.DoCleaning();
};

export default identificatorApi;
