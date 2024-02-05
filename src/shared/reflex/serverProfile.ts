import { createProducer } from "@rbxts/reflex";
import { SerializedVector3, serializeVector3 } from "shared/util/serializer";

const names: string[] = ["Jason", "Nathan", "Rick"];
const surnames: string[] = ["Smith", "White", "Grime", "Madador"];

export interface State {
	money: number;
	bank: number;

	hunger: number;
	thirst: number;

	name?: string;
	surname?: string;

	isTyping: boolean;

	inventoryContainerId?: number;
	externalContainerId?: number;

	id?: number;
	location: string;

	bankAccountNumber?: string;
	usedBankAccountNumber?: string;

	lastPlayerPosition?: SerializedVector3;
	lastCharacterHealth?: number;
}

export interface Actions {
	secureAddHunger: (amountToAdd: number) => void;
	secureRemoveHunger: (amountToSubtract: number) => void;

	secureAddThirst: (amountToAdd: number) => void;
	secureRemoveThirst: (amountToSubtract: number) => void;

	secureSetInventoryContainerId: (containerId: number) => void;

	secureSetLastPlayerPosition: (position: Vector3 | undefined) => void;
	secureSetLastCharacterHealth: (health?: number) => void;

	secureOpenExternalContainer: (containerId: number) => void;
	closeExternalContainer: () => void;

	secureAssignId: (id: number) => void;
	secureAssignBankAccountNumber: (accountNumber: string) => void;

	secureUseBankAccount: (accountNumber: string) => void;
	stopUsingBankAccount: () => void;

	secureModifyMoney: (difference: number) => void;

	startTyping: () => void;
	endTyping: () => void;

	setLocation: (location: string) => void;
}

export const defaultState: State = {
	money: 1337,
	bank: 1000,

	isTyping: false,

	hunger: 100,
	thirst: 100,

	location: "",

	name: names[math.random(0, names.size() - 1)],
	surname: surnames[math.random(0, names.size() - 1)],
};

export const saveExceptions: Partial<keyof State>[] = [
	"externalContainerId",
	"isTyping",
	"id",
	"location",
	"usedBankAccountNumber",
];
export const replicationExceptions: Partial<keyof Actions>[] = [
	"secureSetLastPlayerPosition",
	"secureSetLastCharacterHealth",
];

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
		secureSetInventoryContainerId: (oldState: State, inventoryContainerId: number): State => {
			const state = { ...oldState };
			state.inventoryContainerId = inventoryContainerId;

			return state;
		},
		secureOpenExternalContainer: (oldState: State, inventoryContainerId: number): State => {
			const state = { ...oldState };
			state.externalContainerId = inventoryContainerId;

			return state;
		},
		closeExternalContainer: (oldState: State): State => {
			const state = { ...oldState };
			state.externalContainerId = undefined;

			return state;
		},
		secureSetLastPlayerPosition: (oldState: State, position: Vector3 | undefined) => {
			const state = { ...oldState };
			state.lastPlayerPosition = position === undefined ? undefined : serializeVector3(position);

			return state;
		},
		secureSetLastCharacterHealth: (oldState: State, health: number | undefined) => {
			const state = { ...oldState };
			state.lastCharacterHealth = health;

			print(health);

			return state;
		},
		startTyping: (oldState: State): State => {
			const state = { ...oldState };
			state.isTyping = true;

			return state;
		},
		endTyping: (oldState: State): State => {
			const state = { ...oldState };
			state.isTyping = false;

			return state;
		},
		secureAssignId: (oldState: State, id: number): State => {
			const state = { ...oldState };
			state.id = id;

			return state;
		},
		secureAssignBankAccountNumber: (oldState: State, accountNumber: string): State => {
			const state = { ...oldState };
			state.bankAccountNumber = accountNumber;

			return state;
		},
		secureUnassignBankAccountNumber: (oldState: State): State => {
			const state = { ...oldState };
			state.bankAccountNumber = undefined;

			return state;
		},
		secureUseBankAccount: (oldState: State, accountNumber: string): State => {
			const state = { ...oldState };
			state.usedBankAccountNumber = accountNumber;

			return state;
		},
		stopUsingBankAccount: (oldState: State): State => {
			const state = { ...oldState };
			state.usedBankAccountNumber = undefined;

			return state;
		},
		secureModifyMoney: (oldState: State, difference: number): State => {
			if (oldState.money < difference) return oldState;

			const state = { ...oldState };
			state.money = state.money + difference;

			return state;
		},
		setLocation: (oldState: State, location: string): State => {
			const state = { ...oldState };
			state.location = location;

			return state;
		},
	});

	return producer;
};

export type ProfileProducer = ReturnType<typeof CreateProducer>;
