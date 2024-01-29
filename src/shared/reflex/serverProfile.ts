import { createProducer } from "@rbxts/reflex";

export interface State {
	count: number;
	test: string;

	hunger: number;
	thirst: number;
}

export interface Actions {
	increment: () => void;

	addHunger: (amountToAdd: number) => void;
	removeHunger: (amountToSubtract: number) => void;

	addThirst: (amountToAdd: number) => void;
	removeThirst: (amountToSubtract: number) => void;
}

export const defaultState: State = {
	count: 0,
	test: "test rekoncylacji, dziala??",

	hunger: 100,
	thirst: 100,
};

export const saveExceptions: (keyof State)[] = [];

export const CreateProducer = (initialState: State) => {
	const producer = createProducer(initialState, {
		increment: (oldState: State): State => {
			const state = table.clone(oldState);
			state.count++;

			return state;
		},
		addHunger: (oldState: State, amountToAdd: number): State => {
			const state = { ...oldState };
			state.hunger = math.clamp(state.hunger + amountToAdd, 0, 100);

			return state;
		},
		removeHunger: (oldState: State, amountToSubtract: number): State => {
			const state = { ...oldState };
			state.hunger = math.clamp(state.hunger - amountToSubtract, 0, 100);

			return state;
		},
		addThirst: (oldState: State, amountToAdd: number): State => {
			const state = { ...oldState };
			state.thirst = math.clamp(state.thirst + amountToAdd, 0, 100);

			return state;
		},
		removeThirst: (oldState: State, amountToSubtract: number): State => {
			const state = { ...oldState };
			state.thirst = math.clamp(state.thirst - amountToSubtract, 0, 100);

			return state;
		},
	});

	return producer;
};

export type ProfileProducer = ReturnType<typeof CreateProducer>;
