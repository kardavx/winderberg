import { createProducer } from "@rbxts/reflex";
import { Notification, StoredNotification } from "shared/data/notificationData";

export interface State {
	count: number;
	stamina: number;
	mouseEnablers: string[];
	lockEnablers: string[];
	notifications: StoredNotification[];
}

export interface Actions {
	increment: () => void;
	addMouseEnabler: (enablerId: string) => void;
	removeMouseEnabler: (enablerId: string) => void;

	addLockEnabler: (enablerId: string) => void;
	removeLockEnabler: (enablerId: string) => void;

	addStamina: (amountToAdd: number) => void;
	removeStamina: (amountToSubtract: number) => void;

	pushNotification: (notification: Notification) => void;
	removeNotification: (index: number) => void;
}

export const defaultState: State = {
	count: 0,
	stamina: 100,
	mouseEnablers: [],
	lockEnablers: [],
	notifications: [],
};

export const CreateProducer = (initialState: State) => {
	const producer = createProducer(initialState, {
		increment: (oldState: State): State => {
			const state = table.clone(oldState);
			state.count++;

			return state;
		},
		addMouseEnabler: (oldState: State, enablerId: string): State => {
			if (oldState.mouseEnablers.find((enabler) => enabler === enablerId) !== undefined) {
				return oldState;
			}

			const state = table.clone(oldState);
			state.mouseEnablers = table.clone(state.mouseEnablers);
			state.mouseEnablers.push(enablerId);

			return state;
		},
		removeMouseEnabler: (oldState: State, enablerId: string): State => {
			const index = oldState.mouseEnablers.indexOf(enablerId);
			if (index === -1) {
				return oldState;
			}

			const state = table.clone(oldState);
			state.mouseEnablers = table.clone(state.mouseEnablers);
			state.mouseEnablers.remove(index);

			return state;
		},
		addLockEnabler: (oldState: State, enablerId: string): State => {
			if (oldState.lockEnablers.find((enabler) => enabler === enablerId) !== undefined) {
				return oldState;
			}

			const state = table.clone(oldState);
			state.lockEnablers = table.clone(state.lockEnablers);
			state.lockEnablers.push(enablerId);

			return state;
		},
		removeLockEnabler: (oldState: State, enablerId: string): State => {
			const index = oldState.lockEnablers.indexOf(enablerId);
			if (index === -1) {
				return oldState;
			}

			const state = table.clone(oldState);
			state.lockEnablers = table.clone(state.lockEnablers);
			state.lockEnablers.remove(index);

			return state;
		},
		pushNotification: (oldState: State, notification: Notification): State => {
			print("pushing notification");

			const state = table.clone(oldState);
			state.notifications = table.clone(state.notifications);
			state.notifications.push({ ...notification, ...{ pushTick: tick() } });

			return state;
		},
		removeNotification: (oldState: State, index: number): State => {
			if (!oldState.notifications[index]) return oldState;

			const state = table.clone(oldState);
			state.notifications = table.clone(state.notifications);
			state.notifications.remove(index);

			return state;
		},
		addStamina: (oldState: State, amountToAdd: number): State => {
			const state = { ...oldState };
			state.stamina = math.clamp(state.stamina + amountToAdd, 0, 100);

			return state;
		},
		removeStamina: (oldState: State, amountToSubtract: number): State => {
			const state = { ...oldState };
			state.stamina = math.clamp(state.stamina - amountToSubtract, 0, 100);

			return state;
		},
	});

	return producer;
};

export type ClientProducer = ReturnType<typeof CreateProducer>;
