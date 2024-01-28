import { createProducer } from "@rbxts/reflex";
import { Notification, StoredNotification } from "shared/data/notificationData";

export interface State {
	count: number;
	mouseEnablers: string[];
	notifications: StoredNotification[];
}

export interface Actions {
	increment: () => void;
	addMouseEnabler: (enablerId: string) => void;
	removeMouseEnabler: (enablerId: string) => void;
	pushNotification: (notification: Notification) => void;
	removeNotification: (index: number) => void;
}

export const defaultState: State = {
	count: 0,
	mouseEnablers: [],
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
		pushNotification: (oldState: State, notification: Notification): State => {
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
	});

	return producer;
};

export type ClientProducer = ReturnType<typeof CreateProducer>;
