import Maid from "@rbxts/maid";
import clientSignals from "shared/signal/clientSignals";
import { getServerProfile, getServerState } from "./clientPlayerData";
import { ProfileProducer } from "shared/reflex/serverProfile";
import reactiveValue from "shared/util/reactiveValue";
import itemTypeFunctionalities from "shared/data/itemTypeFunctionalities";

type Item = { id: number; cleanup: () => Promise<void>; promise: Promise<void> };

const waitForContainerInit = (serverProfile: ProfileProducer): Promise<void> => {
	return new Promise((resolve) => {
		if (serverProfile.getState().inventoryContainerId !== undefined) {
			resolve();
			return;
		}

		const unsubscribe = serverProfile.subscribe(
			(state) => state.inventoryContainerId,
			() => {
				resolve();
				unsubscribe();
			},
		);
	});
};

const 

const inventory: InitializerFunction = () => {
	const maid = new Maid();
	const equipped = reactiveValue([] as Item[]);

	let profile = getServerProfile();

	const onPlayerData = (serverProfile: ProfileProducer) => {
		waitForContainerInit(serverProfile).andThen(() => {
			profile = serverProfile;
		});
	};

	const getEquipped = (itemId: number): Item | undefined => {
		return equipped.get().find((item) => item.id === itemId);
	};

	const existingProfile = getServerProfile();
	if (existingProfile) {
		onPlayerData(existingProfile);
	} else {
		clientSignals.playerDataLoaded.Once(() => onPlayerData(getServerProfile() as ProfileProducer));
	}

	maid.GiveTask(
		clientSignals.handleItemEquip.Connect((index: number) => {
			const serverState = getServerState();
			if (!serverState || !profile) return;

			const container = serverState.getState().containers[profile.getState().inventoryContainerId as number];
			const desiredItem = container.content[index];

			const equippedItem = getEquipped(desiredItem.id);
			if (equippedItem) {
				if (equippedItem.promise.getStatus() !== Promise.Status.Resolved) return;

				equippedItem.promise = equippedItem.cleanup();
				equippedItem.promise.andThen(() => {
					if (!profile) return;

					profile.unequipItem(equippedItem.id);
					equipped.set((oldValue) => {
						const equippedItemIndex = oldValue.findIndex((item) => item === equippedItem);
						if (equippedItemIndex === undefined) return oldValue;

						const newValue = [...oldValue];
						newValue.remove(equippedItemIndex);

						return newValue;
					});
				});
			} else {
				const returned = itemTypeFunctionalities[desiredItem.type](desiredItem, (state) => {
					const containerItem = state.containers[
						profile!.getState().inventoryContainerId as number
					].content.find((item) => item.id === desiredItem.id);
					return containerItem!.state;
				});

				if (!returned) return;

				profile!.equipItem(desiredItem.id);
				const [cleanup, promise] = returned;

				equipped.set((oldValue) => {
					const newValue = [...oldValue];
					newValue.push({
						id: desiredItem.id,
						cleanup,
						promise,
					});

					return newValue;
				});
			}
		}),
	);

	return () => maid.DoCleaning();
};

export default inventory;
