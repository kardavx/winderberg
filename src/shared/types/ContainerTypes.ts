import { ItemState, ItemType } from "shared/data/itemTypesData";

export type ContainerItem = {
	name: string;
	type: ItemType;
	state: ItemState[ItemType];
};

export type ContainerSchema = {
	maxWeight: number;
	content: ContainerItem[];
};

export type ContainersSchema = ContainerSchema[];
