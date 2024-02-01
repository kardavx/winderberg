import { createProducer } from "@rbxts/reflex";
import { ItemType } from "shared/data/itemTypesData";
import { ContainerItem, ContainersSchema } from "shared/types/ContainerTypes";

export interface State {
	serverStartTick: number;
	containers: ContainersSchema;
}

export interface Actions {
	secureCreateContainer: (maxWeight: number) => void;
	secureAddItemToContainer: (containerId: number, item: ContainerItem<ItemType>) => void;
	secureRemoveItemFromContainer: (containerId: number, index: number) => void;
	secureSetServerStartTick: (tick: number) => void;
}

export const defaultState: State = {
	serverStartTick: 0,
	containers: [],
};

export const saveExceptions: (keyof State)[] = ["serverStartTick"];

export const CreateProducer = (initialState: State) => {
	const producer = createProducer(initialState, {
		secureSetServerStartTick: (oldState: State, tick: number): State => {
			const state = { ...oldState };
			state.serverStartTick = tick;

			return state;
		},
		secureCreateContainer: (oldState: State, maxWeight: number): State => {
			const state = { ...oldState };
			state.containers = [...state.containers];
			state.containers.push({
				maxWeight,
				content: [],
			});

			return state;
		},
		secureAddItemToContainer: (oldState: State, containerId: number, item: ContainerItem<ItemType>): State => {
			if (oldState.containers[containerId] === undefined) return oldState;

			const state = { ...oldState };
			state.containers = [...state.containers];
			state.containers[containerId] = { ...state.containers[containerId] };
			state.containers[containerId].content.push(item);

			return state;
		},
		secureRemoveItemFromContainer: (oldState: State, containerId: number, index: number): State => {
			if (oldState.containers[containerId] === undefined || oldState.containers[containerId].content[index])
				return oldState;

			const state = { ...oldState };
			state.containers = [...state.containers];
			state.containers[containerId] = { ...state.containers[containerId] };
			state.containers[containerId].content.remove(index);

			return state;
		},
	});

	return producer;
};

export type ServerProducer = ReturnType<typeof CreateProducer>;
