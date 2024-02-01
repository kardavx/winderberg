import { SaveableStateData } from "shared/types/ContainerTypes";

export type ItemTypes = ["Primary", "Secondary", "Food", "Water"];
export type ItemType = ItemTypes[number];

type ItemStateSchema = {
	[itemType in ItemType]: { weight: number; [key: string]: SaveableStateData };
};

export interface ItemState extends ItemStateSchema {}

export const itemTypes: ItemTypes = ["Primary", "Secondary", "Food", "Water"];
export const defaultItemState: ItemState = {
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

export const itemDisplayTypes: { [itemType in ItemType]: string } = {
	Primary: "Broń Długa",
	Secondary: "Broń Krótka",
	Food: "Jedzenie",
	Water: "Napój",
};
