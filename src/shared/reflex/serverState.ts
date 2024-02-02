import { createProducer } from "@rbxts/reflex";
import { ContainerItem, ContainersSchema } from "shared/types/ContainerTypes";

export interface State {
	serverStartTick: number;
	containers: ContainersSchema;
	storageContainerIds: { [storageId: string]: number };
}

export interface Actions {
	secureCreateContainer: (maxWeight: number, name?: string) => void;
	secureAddItemToContainer: (containerId: number, item: ContainerItem) => void;
	secureRemoveItemFromContainer: (containerId: number, index: number) => void;
	secureSetServerStartTick: (tick: number) => void;
	secureSetStorageContainerId: (storageId: string, containerId: number) => void;
}

export const defaultState: State = {
	serverStartTick: 0,
	containers: [],
	storageContainerIds: {},
};

export const saveExceptions: Partial<keyof State>[] = ["serverStartTick"];
export const replicationExceptions: Partial<keyof Actions>[] = ["secureSetStorageContainerId"];

export const CreateProducer = (initialState: State) => {
	const producer = createProducer(initialState, {
		secureSetServerStartTick: (oldState: State, tick: number): State => {
			const state = { ...oldState };
			state.serverStartTick = tick;

			return state;
		},
		secureCreateContainer: (oldState: State, maxWeight: number, name: string = "Kontener"): State => {
			const state = { ...oldState };
			state.containers = [...state.containers];
			state.containers.push({
				maxWeight,
				name,
				content: [],
			});

			return state;
		},
		secureAddItemToContainer: (oldState: State, containerId: number, item: ContainerItem): State => {
			if (oldState.containers[containerId] === undefined) return oldState;

			const state = { ...oldState };
			state.containers = [...state.containers];
			state.containers[containerId] = { ...state.containers[containerId] };
			state.containers[containerId].content = [...state.containers[containerId].content];
			state.containers[containerId].content.push(item);

			return state;
		},
		secureRemoveItemFromContainer: (oldState: State, containerId: number, index: number): State => {
			if (
				oldState.containers[containerId] === undefined ||
				oldState.containers[containerId].content[index] === undefined
			)
				return oldState;

			const state = { ...oldState };
			state.containers = [...state.containers];
			state.containers[containerId] = { ...state.containers[containerId] };
			state.containers[containerId].content = [...state.containers[containerId].content];
			state.containers[containerId].content.remove(index);

			return state;
		},
		secureSetStorageContainerId: (oldState: State, storageId: string, containerId: number): State => {
			const state = { ...oldState };
			state.storageContainerIds = { ...state.storageContainerIds };
			state.storageContainerIds[storageId] = containerId;

			return state;
		},
	});

	return producer;
};

export type ServerProducer = ReturnType<typeof CreateProducer>;
