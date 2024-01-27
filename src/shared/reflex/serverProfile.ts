import { Producer, createProducer } from "@rbxts/reflex";
import { t } from "@rbxts/t";

export type ProfileProducer = Producer<State, Actions>;

export interface State {}

export interface Actions {}

export const defaultState: State = {};

export const runtimeStateValidation: { [key in keyof State]: t.check<unknown> } = {};

export const saveExceptions: (keyof State)[] = [];

export const CreateProducer = (initialState: State): Producer<State, Actions> => {
	const producer = createProducer(initialState, {});

	return producer as unknown as Producer<State, Actions>;
};
