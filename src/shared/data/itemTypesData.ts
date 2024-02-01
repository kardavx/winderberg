export type ItemTypes = ["Primary", "Secondary", "Food", "Water"];
export type ItemType = ItemTypes[number];

type ItemStateSchema = {
	[itemType in ItemType]: { weight: number; [key: string]: unknown };
};

export interface ItemState extends ItemStateSchema {
	Primary: {
		weight: number;
		ammo: number;
	};
	Food: {
		weight: number;
		adds: number;
	};
	Water: {
		weight: number;
		adds: number;
	};
}

export const itemTypes: ItemTypes = ["Primary", "Secondary", "Food", "Water"];
export const defaultItemState: ItemState = {
	Primary: {
		weight: 10,
		ammo: 0,
	},
	Secondary: {
		weight: 5,
	},
	Food: {
		weight: 0.5,
		adds: 20,
	},
	Water: {
		weight: 1,
		adds: 20,
	},
};

export const itemDisplayTypes: { [itemType in ItemType]: string } = {
	Primary: "Broń Długa",
	Secondary: "Broń Krótka",
	Food: "Jedzenie",
	Water: "Napój",
};
