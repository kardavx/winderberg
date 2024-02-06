import { ItemStateSchema, ItemType, TypeStateSchema } from "shared/data/itemTypesData";

type SaveableTypes = string | number | boolean;
type SaveableTable = { [key: string]: SaveableTypes & SaveableTypes };
export type SaveableStateData = SaveableTypes | SaveableTable;

export type ContainerItem = {
	name: string;
	type: ItemType;
	id: number;
	state: TypeStateSchema;
};

export type ConfigItem = {
	name: string;
	type: ItemType;
	state: ItemStateSchema;
};

export type ContainerSchema = {
	maxWeight: number;
	name: string;
	content: ContainerItem[];
};

export type ContainersSchema = ContainerSchema[];
