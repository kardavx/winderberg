import serverSignals from "shared/signal/serverSignals";
import { getPlayerProfile } from "./serverData";
import Maid from "@rbxts/maid";

const hungerUsageFactor = 1;
const thirstUsageFactor = 2;

const updateInterval = 10;

const vitals: InitializerFunction = () => {
	const maid = new Maid();
	const playerUpdateTicks: { [name: string]: { player: Player; tick: number } } = {};

	maid.GiveTask(
		serverSignals.playerAdded.Connect((player: Player) => {
			playerUpdateTicks[player.Name] = { player, tick: tick() + updateInterval };
		}),
	);

	maid.GiveTask(serverSignals.playerRemoving.Connect((player: Player) => delete playerUpdateTicks[player.Name]));

	maid.GiveTask(
		serverSignals.onUpdate.Connect((deltaTime: number) => {
			for (const [_, { player, tick: updateTick }] of pairs(playerUpdateTicks)) {
				const playerData = getPlayerProfile(player);
				if (!playerData) {
					playerUpdateTicks[player.Name].tick = tick() + updateInterval;
					return;
				}

				if (tick() >= updateTick) {
					playerData.producer.secureRemoveHunger(hungerUsageFactor);
					playerData.producer.secureRemoveThirst(thirstUsageFactor);
					playerUpdateTicks[player.Name].tick = tick() + updateInterval;
				}
			}
		}),
	);

	return () => maid.DoCleaning();
};

export default vitals;
