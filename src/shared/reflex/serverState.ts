import { Producer, createProducer } from "@rbxts/reflex";
import { t } from "@rbxts/t";

export type ServerProducer = Producer<State, Actions>;

export interface State {
	count: number;
}

export interface Actions {
	increment: () => void;
}

export const defaultState: State = {
	count: 0,
};

export const runtimeStateValidation: { [key in keyof State]: t.check<unknown> } = {
	count: t.integer,
};

export const saveExceptions: (keyof State)[] = [];

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
