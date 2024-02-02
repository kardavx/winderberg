import Maid from "@rbxts/maid";
import serverSignals from "shared/signal/serverSignals";
import { getPlayerProfile, waitForPlayerProfile } from "./serverData";
import { addItemsToContainer, createContainer } from "server/module/containers";
import { defaultInventoryItems, inventoryContainerMaxWeight } from "shared/data/containerData";
import { deserializeVector3 } from "shared/util/serializer";
import { Players } from "@rbxts/services";

const updateInterval = 10;
let nextUpdateTick = tick();

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
				const producerState = profile.producer.getState();

				if (producerState.inventoryContainerId === undefined) {
					createContainer(inventoryContainerMaxWeight).andThen((containerId: number) => {
						profile.producer.secureSetInventoryContainerId(containerId);
						addItemsToContainer(containerId, defaultInventoryItems).catch((err: string) => {
							throw err;
						});
					});
				}

				print(producerState.lastPlayerPosition);
				if (producerState.lastPlayerPosition) {
					const deserializedVector = deserializeVector3(producerState.lastPlayerPosition);
					if (player.Character) {
						player.Character.PivotTo(new CFrame(deserializedVector));
					} else {
						player.CharacterAdded.Once((character: Model) => {
							task.wait();
							character.PivotTo(new CFrame(deserializedVector));
						});
					}
				}
			});
		}),
	);

	maid.GiveTask(
		serverSignals.onUpdate.Connect((_) => {
			if (tick() >= nextUpdateTick) {
				nextUpdateTick = tick() + updateInterval;
				print("UPDATING PLAYER POSITIONS");
				Players.GetPlayers().forEach((player: Player) => {
					if (!player.Character) return;

					const playerProfile = getPlayerProfile(player);
					if (!playerProfile) return;

					playerProfile.producer.secureSetLastPlayerPosition(player.Character.GetPivot().Position);
				});
			}
		}),
	);

	return () => {
		maid.DoCleaning();
	};
};

export default playerBinder;
