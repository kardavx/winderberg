import { SaveableStateData } from "shared/types/ContainerTypes";

export type ItemTypes = ["Primary", "Secondary", "Food", "Water"];
export type ItemType = ItemTypes[number];

export interface TypeStateSchema {
	weight: number;
	[key: string]: SaveableStateData;
}

export interface ItemStateSchema {
	[key: string]: SaveableStateData;
}

export const itemTypes: ItemTypes = ["Primary", "Secondary", "Food", "Water"];

export const defaultTypeState: { [itemType in ItemType]: TypeStateSchema } = {
	Primary: {
		weight: 10,
	},
	Secondary: {
		weight: 5,
	},
	Food: {
		weight: 0.5,
	},
	Water: {
		weight: 1,
	},
};

export const handHeldItemTypes: ItemType[] = ["Primary", "Secondary"];

export const itemDisplayTypes: { [itemType in ItemType]: string } = {
	Primary: "Broń Długa",
	Secondary: "Broń Krótka",
	Food: "Jedzenie",
	Water: "Napój",
};
