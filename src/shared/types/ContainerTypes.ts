type SaveableTypes = string | number | boolean;
type SaveableTable = { [key: string]: SaveableTypes & SaveableTypes };
export type SaveableStateData = SaveableTypes | SaveableTable;

export type ContainerItem = {
	name: string;
	type: string;
	state: { weight: number; [key: string]: SaveableStateData };
};

export type ContainerSchema = {
	maxWeight: number;
	name: string;
	content: ContainerItem[];
};

export type ContainersSchema = ContainerSchema[];
