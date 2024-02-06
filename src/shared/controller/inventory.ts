import Maid from "@rbxts/maid";
import clientSignals from "shared/signal/clientSignals";
import { getServerProfile, getServerState } from "./clientPlayerData";
import { ProfileProducer } from "shared/reflex/serverProfile";
import reactiveValue from "shared/util/reactiveValue";

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

const inventory: InitializerFunction = () => {
	const maid = new Maid();
	const equipped = reactiveValue([] as Item[]);
	const equippingBlock = false;

	let profile = getServerProfile();

	const onPlayerData = (serverProfile: ProfileProducer) => {
		waitForContainerInit(serverProfile).andThen(() => {
			profile = serverProfile;
		});
	};

	const getEquipped = (itemId: number): Item | undefined => {
		let equippedItem: Item | undefined = undefined;

		equipped.get().forEach((item) => {
			if (item.id === itemId) equippedItem = item;
		});

		return equippedItem;
	};

	const existingProfile = getServerProfile();
	if (existingProfile) {
		onPlayerData(existingProfile);
	} else {
		clientSignals.playerDataLoaded.Once(() => onPlayerData(getServerProfile() as ProfileProducer));
	}

	maid.GiveTask(
		equipped.subscribe((newEquipped, oldEquipped) => {
			// handle equipped
			newEquipped.forEach((equippedItem) => {
				if (!oldEquipped.includes(equippedItem)) {
					// equip
				}
			});

			// handle unequipped
			oldEquipped.forEach((equippedItem) => {
				if (!newEquipped.includes(equippedItem)) {
					// unequip
				}
			});
		}),
	);

	maid.GiveTask(
		clientSignals.handleItemEquip.Connect((index: number) => {
			const serverState = getServerState();
			if (!serverState || !profile) return;

			const container = serverState.getState().containers[profile.getState().inventoryContainerId as number];
			const desiredItem = container.content[index];

			const equippedItem = getEquipped(desiredItem.id);
			if (equippedItem) {
				if (equippedItem.promise.getStatus() !== Promise.Status.Resolved) return;
			} else {
			}
		}),
	);

	return () => maid.DoCleaning();
};

export default inventory;
