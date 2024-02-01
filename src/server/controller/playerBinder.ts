import Maid from "@rbxts/maid";
import serverSignals from "shared/signal/serverSignals";
import { waitForPlayerProfile } from "./serverData";
import { addItemsToContainer, createContainer } from "server/module/containers";
import { defaultInventoryItems, inventoryContainerMaxWeight } from "shared/data/containerData";

const playerBinder: InitializerFunction = () => {
	const maid = new Maid();

	maid.GiveTask(
		serverSignals.characterAdded.Connect((_, character: Model) => {
			character.SetAttribute("interactionType", "Player");
			character.AddTag("interaction");
		}),
	);

	maid.GiveTask(
		serverSignals.playerAdded.Connect((player: Player) => {
			waitForPlayerProfile(player).andThen((profile) => {
				if (profile.producer.getState().inventoryContainerId === undefined) {
					createContainer(inventoryContainerMaxWeight).andThen((containerId: number) => {
						profile.producer.secureSetInventoryContainerId(containerId);
						addItemsToContainer(containerId, defaultInventoryItems).catch((err: string) => {
							throw err;
						});
					});
				}
			});
		}),
	);

	return () => {
		maid.DoCleaning();
	};
};

export default playerBinder;
