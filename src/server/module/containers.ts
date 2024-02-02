import { ContainerItem } from "shared/types/ContainerTypes";
import { waitForServerState } from "../controller/serverData";
import getItemsWeight from "shared/util/getItemsWeight";

const containerNotFound = () => `NO_CONTAINER`;
const itemNotFound = () => `NO_ITEM`;
const tooMuchWeight = () => `TOO_MUCH_WEIGHT`;

export const createContainer = (maxWeight: number, name?: string): Promise<number> => {
	return new Promise((resolve) => {
		waitForServerState().andThen((serverState) => {
			const producerState = serverState.producer.getState();
			const containerId = producerState.containers.size();

			serverState.producer.secureCreateContainer(maxWeight, name);
			resolve(containerId);
		});
	});
};

export const addItemToContainer = (containerId: number, item: ContainerItem): Promise<void> => {
	return new Promise((resolve, reject) => {
		waitForServerState().andThen((serverState) => {
			const producerState = serverState.producer.getState();
			if (!producerState.containers[containerId]) {
				reject(containerNotFound());
				return;
			}

			const incomingItemsWeight = item.state.weight;
			const carryingWeight = getItemsWeight(producerState.containers[containerId].content);

			if (carryingWeight + incomingItemsWeight > producerState.containers[containerId].maxWeight) {
				reject(tooMuchWeight());
				return;
			}

			serverState.producer.secureAddItemToContainer(containerId, item);

			resolve();
		});
	});
};

export const addItemsToContainer = (containerId: number, items: ContainerItem[]): Promise<void> => {
	return new Promise((resolve, reject) => {
		waitForServerState().andThen((serverState) => {
			const producerState = serverState.producer.getState();
			if (!producerState.containers[containerId]) {
				reject(containerNotFound());
				return;
			}

			const incomingItemsWeight = getItemsWeight(items);
			const carryingWeight = getItemsWeight(producerState.containers[containerId].content);

			if (carryingWeight + incomingItemsWeight > producerState.containers[containerId].maxWeight) {
				reject(tooMuchWeight());
				return;
			}

			items.forEach((item) => {
				serverState.producer.secureAddItemToContainer(containerId, item);
			});

			resolve();
		});
	});
};

export const removeItemsFromContainer = (containerId: number, indexes: number[]): Promise<void> => {
	return new Promise((resolve, reject) => {
		waitForServerState().andThen((serverState) => {
			const producerState = serverState.producer.getState();
			if (!producerState.containers[containerId]) {
				reject(containerNotFound());
				return;
			}

			indexes.forEach((index) => {
				if (!producerState.containers[containerId].content[index]) {
					reject(itemNotFound());
					return;
				}

				serverState.producer.secureRemoveItemFromContainer(containerId, index);
			});

			resolve();
		});
	});
};

export const transferItemToContainer = (
	fromContainerId: number,
	toContainerId: number,
	index: number,
): Promise<void> => {
	return new Promise((resolve, reject) => {
		waitForServerState().andThen((serverState) => {
			const producerState = serverState.producer.getState();
			if (!producerState.containers[fromContainerId]) {
				reject(containerNotFound());
				return;
			}

			if (!producerState.containers[toContainerId]) {
				reject(containerNotFound());
				return;
			}

			let transferredItem = producerState.containers[fromContainerId].content[index];
			if (!transferredItem) {
				reject(itemNotFound());
				return;
			}

			const carryingWeight = getItemsWeight(producerState.containers[toContainerId].content);
			if (carryingWeight + transferredItem.state.weight > producerState.containers[toContainerId].maxWeight) {
				reject(tooMuchWeight());
				return;
			}

			transferredItem = { ...transferredItem };
			serverState.producer.secureRemoveItemFromContainer(fromContainerId, index);
			serverState.producer.secureAddItemToContainer(toContainerId, transferredItem);

			resolve();
		});
	});
};
