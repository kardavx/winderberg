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
	const characterMaids: { [name: string]: Maid } = {};

	maid.GiveTask(
		serverSignals.characterAdded.Connect((player, character: Model) => {
			const actualCharacter = character as Character;
			actualCharacter.SetAttribute("interactionType", "Player");
			actualCharacter.AddTag("interaction");

			const playerProfile = getPlayerProfile(player);
			if (playerProfile) {
				playerProfile.producer.secureSetLastCharacterHealth(actualCharacter.Humanoid.Health);
			}

			characterMaids[player.Name] = new Maid();
			characterMaids[player.Name].GiveTask(
				actualCharacter.Humanoid.GetPropertyChangedSignal("Health").Connect(() => {
					const playerProfile = getPlayerProfile(player);
					if (!playerProfile) return;

					if (actualCharacter.Humanoid.Health === 0) {
						playerProfile.producer.secureSetLastCharacterHealth(undefined);
					} else {
						playerProfile.producer.secureSetLastCharacterHealth(actualCharacter.Humanoid.Health);
					}
				}),
			);
		}),
	);

	maid.GiveTask(
		serverSignals.characterRemoving.Connect((player) => {
			if (characterMaids[player.Name]) {
				characterMaids[player.Name].DoCleaning();
				delete characterMaids[player.Name];
			}
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

				if (player.Character) {
					if (producerState.lastPlayerPosition) {
						const deserializedVector = deserializeVector3(producerState.lastPlayerPosition);
						player.Character.PivotTo(new CFrame(deserializedVector));
					}

					if (producerState.lastCharacterHealth !== undefined) {
						(player.Character as Character).Humanoid.Health = producerState.lastCharacterHealth;
					}
				} else {
					player.CharacterAdded.Once((character: Model) => {
						task.wait();
						if (producerState.lastPlayerPosition) {
							const deserializedVector = deserializeVector3(producerState.lastPlayerPosition);
							character.PivotTo(new CFrame(deserializedVector));
						}

						if (producerState.lastCharacterHealth !== undefined) {
							(character as Character).Humanoid.Health = producerState.lastCharacterHealth;
						}
					});
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
