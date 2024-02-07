import Maid from "@rbxts/maid";
import clientSignals from "shared/signal/clientSignals";
import {
	clientProducer,
	getServerProfile,
	getServerState,
	waitForServerProfile,
	waitForServerState,
} from "./clientPlayerData";
import { ContainerItem } from "shared/types/ContainerTypes";
import { handHeldItemTypes } from "shared/data/itemTypesData";
import itemTypeFunctionalities from "shared/data/itemTypeFunctionalities";
import { ProfileProducer } from "shared/reflex/serverProfile";

interface EquippedItem {
	id: number;
	cleanup: () => Promise<void>;
	cleanupQueued: boolean;
	promise: Promise<void>;
}

const isEquipped = (equippedItems: EquippedItem[], itemId: number) =>
	equippedItems.find((item) => item.id === itemId) !== undefined;

const waitForInventoryContainerInit = (serverProfile: ProfileProducer): Promise<number> => {
	return new Promise((resolve) => {
		const profileState = serverProfile.getState();
		if (profileState.inventoryContainerId !== undefined) {
			resolve(profileState.inventoryContainerId);
			return;
		}

		const unsubscribe = serverProfile.subscribe(
			(state) => state.inventoryContainerId,
			(containerId: number | undefined) => {
				if (containerId === undefined) return;

				resolve(containerId);
				unsubscribe();
			},
		);
	});
};

const getContainerItem = (itemId: number): ContainerItem | undefined => {
	const playerProfile = getServerProfile();
	if (!playerProfile) return;

	const serverState = getServerState();
	if (!serverState) return;

	const profileState = playerProfile.getState();
	if (profileState.inventoryContainerId === undefined) return;

	const playerContainerContent = serverState.getState().containers[profileState.inventoryContainerId].content;
	return playerContainerContent.find((item) => item.id === itemId);
};

const isItemHandheld = (containerItem: ContainerItem): boolean => {
	return handHeldItemTypes.includes(containerItem.type);
};

const getHandheldItemEquipped = (equippedItems: EquippedItem[]): EquippedItem | undefined => {
	return equippedItems.find((item) => {
		const containerItem = getContainerItem(item.id);
		if (!containerItem) return false;

		if (isItemHandheld(containerItem)) return true;
	});
};

const isHandlheldItemEquipped = (equippedItems: EquippedItem[]): boolean => {
	return getHandheldItemEquipped(equippedItems) !== undefined;
};

const equipItem = (equippedItems: EquippedItem[], itemId: number): Promise<void> => {
	return new Promise((resolve, reject) => {
		if (isEquipped(equippedItems, itemId)) {
			reject();
			return;
		}

		const containerItem = getContainerItem(itemId);
		if (!containerItem) {
			reject();
			return;
		}

		if (isItemHandheld(containerItem) && isHandlheldItemEquipped(equippedItems)) {
			reject();
			return;
		}

		const itemFunctionality = itemTypeFunctionalities[containerItem.type];
		const returned = itemFunctionality(containerItem);
		if (!returned) {
			resolve();
			return;
		}

		clientProducer.onItemEquipped(itemId);

		const [cleanup, promise] = returned;
		equippedItems.push({
			id: itemId,
			cleanupQueued: false,
			cleanup,
			promise,
		});
		promise.andThen(resolve);
	});
};

const unequipItem = (equippedItems: EquippedItem[], itemId: number): Promise<void> => {
	return new Promise((resolve, reject) => {
		if (!isEquipped(equippedItems, itemId)) {
			reject();
			return;
		}

		const equippedItemIndex = equippedItems.findIndex((item) => item.id === itemId);
		if (equippedItemIndex === undefined) {
			reject();
			return;
		}

		const equippedItem = equippedItems[equippedItemIndex];
		if (equippedItem.cleanupQueued === true) {
			reject();
			return;
		}

		const continueUnequip = () => {
			equippedItem.cleanup().andThen(() => {
				equippedItems.remove(equippedItemIndex);
				clientProducer.onItemUnequipped(itemId);
				resolve();
			});
		};

		if (equippedItem.promise.getStatus() === Promise.Status.Started) {
			equippedItem.cleanupQueued = true;
			equippedItem.promise.andThen(continueUnequip);
		} else {
			continueUnequip();
		}
	});
};

const inventory: InitializerFunction = () => {
	const maid = new Maid();
	const equippedItems: EquippedItem[] = [];
	let nextQueuedHandheldItem: number | undefined = undefined;

	maid.GiveTask(
		clientSignals.handleItemEquip.Connect((itemId: number) => {
			if (isEquipped(equippedItems, itemId)) {
				unequipItem(equippedItems, itemId);
			} else {
				const containerItem = getContainerItem(itemId);
				if (!containerItem) return;

				if (isItemHandheld(containerItem)) {
					const handheldItemEquipped = getHandheldItemEquipped(equippedItems);
					if (handheldItemEquipped) {
						if (nextQueuedHandheldItem === undefined) {
							unequipItem(equippedItems, handheldItemEquipped.id).andThen(() => {
								if (nextQueuedHandheldItem === undefined) return;
								equipItem(equippedItems, nextQueuedHandheldItem);
								nextQueuedHandheldItem = undefined;
							});
						}

						nextQueuedHandheldItem = itemId;

						return;
					}
				}

				equipItem(equippedItems, itemId);
			}
		}),
	);

	waitForServerState().andThen((serverState) =>
		waitForServerProfile().andThen((serverProfile) =>
			waitForInventoryContainerInit(serverProfile).andThen((inventoryContainerId: number) => {
				maid.GiveTask(
					serverState.subscribe(
						(state) => state.containers[inventoryContainerId],
						({ content: newContent }, { content: oldContent }) => {
							oldContent.forEach((oldItem) => {
								if (newContent.find((newItem) => newItem.id === oldItem.id) === undefined) {
									/// unequip
									unequipItem(equippedItems, oldItem.id);
								}
							});
						},
					),
				);
			}),
		),
	);

	return () => maid.DoCleaning();
};

export default inventory;
