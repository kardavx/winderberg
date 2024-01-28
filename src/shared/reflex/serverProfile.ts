import { createProducer } from "@rbxts/reflex";

export interface State {
	count: number;
}

export interface Actions {
	increment: () => void;
}

export const defaultState: State = {
	count: 0,
};

export const saveExceptions: (keyof State)[] = [];

export const CreateProducer = (initialState: State) => {
	const producer = createProducer(initialState, {
		increment: (oldState: State): State => {
			const state = table.clone(oldState);
			state.count++;

			return state;
		},
	});

	return producer;
};

export type ProfileProducer = ReturnType<typeof CreateProducer>;
