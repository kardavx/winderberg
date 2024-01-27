import { Producer, createProducer } from "@rbxts/reflex";

export interface State {
	count: number;
}

export interface Actions {
	increment: () => void;
}

export type ClientProducer = Producer<State, Actions>;

export const defaultState: State = {
	count: 0,
};

export const CreateProducer = (initialState: State): Producer<State, Actions> => {
	const producer = createProducer(initialState, {
		increment: (oldState: State): State => {
			const state = table.clone(oldState);
			state.count++;

			return state;
		},
	});

	return producer as unknown as Producer<State, Actions>;
};
