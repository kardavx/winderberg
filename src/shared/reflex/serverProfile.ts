import { createProducer } from "@rbxts/reflex";

const names: string[] = ["Jason", "Nathan", "Rick"];
const surnames: string[] = ["Smith", "White", "Grime", "Madador"];

export interface State {
	money: number;
	bank: number;

	hunger: number;
	thirst: number;

	name?: string;
	surname?: string;
}

export interface Actions {
	secureAddHunger: (amountToAdd: number) => void;
	secureRemoveHunger: (amountToSubtract: number) => void;

	secureAddThirst: (amountToAdd: number) => void;
	secureRemoveThirst: (amountToSubtract: number) => void;
}

export const defaultState: State = {
	money: 1337,
	bank: 1000,

	hunger: 100,
	thirst: 100,

	name: names[math.random(0, names.size() - 1)],
	surname: surnames[math.random(0, names.size() - 1)],
};

export const saveExceptions: Partial<keyof State>[] = [];

export const CreateProducer = (initialState: State) => {
	const producer = createProducer(initialState, {
		secureAddHunger: (oldState: State, amountToAdd: number): State => {
			if (oldState.hunger === 100) return oldState;

			const state = { ...oldState };
			state.hunger = math.clamp(state.hunger + amountToAdd, 0, 100);

			return state;
		},
		secureRemoveHunger: (oldState: State, amountToSubtract: number): State => {
			if (oldState.hunger === 0) return oldState;

			const state = { ...oldState };
			state.hunger = math.clamp(state.hunger - amountToSubtract, 0, 100);

			return state;
		},
		secureAddThirst: (oldState: State, amountToAdd: number): State => {
			if (oldState.thirst === 100) return oldState;

			const state = { ...oldState };
			state.thirst = math.clamp(state.thirst + amountToAdd, 0, 100);

			return state;
		},
		secureRemoveThirst: (oldState: State, amountToSubtract: number): State => {
			if (oldState.thirst === 0) return oldState;

			const state = { ...oldState };
			state.thirst = math.clamp(state.thirst - amountToSubtract, 0, 100);

			return state;
		},
	});

	return producer;
};

export type ProfileProducer = ReturnType<typeof CreateProducer>;
