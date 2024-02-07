import { createProducer } from "@rbxts/reflex";
import { Notification, StoredNotification } from "shared/data/notificationData";

export interface State {
	inventoryOpen: boolean;

	stamina: number;
	staminaUsageMultiplier: number;

	equippedItems: number[];

	mouseEnablers: string[];
	lockEnablers: string[];
	notifications: StoredNotification[];
}

export interface Actions {
	addMouseEnabler: (enablerId: string) => void;
	removeMouseEnabler: (enablerId: string) => void;

	addLockEnabler: (enablerId: string) => void;
	removeLockEnabler: (enablerId: string) => void;

	addStamina: (amountToAdd: number) => void;
	removeStamina: (amountToSubtract: number) => void;

	pushNotification: (notification: Notification) => void;
	removeNotification: (index: number) => void;

	setStaminaUsageMultiplier: (staminaUsageMultiplier: number) => void;

	onItemEquipped: (itemId: number) => void;
	onItemUnequipped: (itemId: number) => void;

	setInventoryOpen: (inventoryOpen: boolean) => void;
}

export const defaultState: State = {
	inventoryOpen: false,

	stamina: 100,
	staminaUsageMultiplier: 1,

	equippedItems: [],

	mouseEnablers: [],
	lockEnablers: [],
	notifications: [],
};

export const CreateProducer = (initialState: State) => {
	const producer = createProducer(initialState, {
		addMouseEnabler: (oldState: State, enablerId: string): State => {
			if (oldState.mouseEnablers.find((enabler) => enabler === enablerId) !== undefined) {
				return oldState;
			}

			const state = { ...oldState };
			state.mouseEnablers = [...state.mouseEnablers];
			state.mouseEnablers.push(enablerId);

			return state;
		},
		removeMouseEnabler: (oldState: State, enablerId: string): State => {
			const index = oldState.mouseEnablers.indexOf(enablerId);
			if (index === -1) {
				return oldState;
			}

			const state = { ...oldState };
			state.mouseEnablers = [...state.mouseEnablers];
			state.mouseEnablers.remove(index);

			return state;
		},
		addLockEnabler: (oldState: State, enablerId: string): State => {
			if (oldState.lockEnablers.find((enabler) => enabler === enablerId) !== undefined) {
				return oldState;
			}

			const state = { ...oldState };
			state.lockEnablers = [...state.lockEnablers];
			state.lockEnablers.push(enablerId);

			return state;
		},
		removeLockEnabler: (oldState: State, enablerId: string): State => {
			const index = oldState.lockEnablers.indexOf(enablerId);
			if (index === -1) {
				return oldState;
			}

			const state = { ...oldState };
			state.lockEnablers = [...state.lockEnablers];
			state.lockEnablers.remove(index);

			return state;
		},
		pushNotification: (oldState: State, notification: Notification): State => {
			const state = { ...oldState };
			state.notifications = [...state.notifications];
			state.notifications.push({ ...notification, ...{ pushTick: tick() } });

			return state;
		},
		removeNotification: (oldState: State, index: number): State => {
			if (!oldState.notifications[index]) return oldState;

			const state = { ...oldState };
			state.notifications = [...state.notifications];
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
		setStaminaUsageMultiplier: (oldState: State, staminaUsageMultiplier: number): State => {
			const state = { ...oldState };
			state.staminaUsageMultiplier = staminaUsageMultiplier;

			return state;
		},
		setInventoryOpen: (oldState: State, inventoryOpen: boolean): State => {
			const state = { ...oldState };
			state.inventoryOpen = inventoryOpen;

			return state;
		},
		onItemEquipped: (oldState: State, itemId: number): State => {
			if (oldState.equippedItems.includes(itemId)) {
				warn(`Attempt to equip an already equipped item of id ${itemId}`);
				return oldState;
			}

			const state = { ...oldState };
			state.equippedItems = [...state.equippedItems];
			state.equippedItems.push(itemId);

			return state;
		},
		onItemUnequipped: (oldState: State, itemId: number): State => {
			const equippedItemIndex = oldState.equippedItems.findIndex((equippeditem) => equippeditem === itemId);
			if (equippedItemIndex === undefined) {
				warn(`Attempt to unequip an unequipped item of id ${itemId}`);
				return oldState;
			}

			const state = { ...oldState };
			state.equippedItems = [...state.equippedItems];
			state.equippedItems.remove(equippedItemIndex);

			return state;
		},
	});

	return producer;
};

export type ClientProducer = ReturnType<typeof CreateProducer>;
