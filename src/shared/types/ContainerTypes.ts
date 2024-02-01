import { ItemState, ItemType } from "shared/data/itemTypesData";

export type ContainerItem<Type extends ItemType> = {
	name: string;
	type: Type;
	state: ItemState[Type];
};

export type ContainerSchema = {
	maxWeight: number;
	content: ContainerItem<ItemType>[];
};

export type ContainersSchema = ContainerSchema[];
