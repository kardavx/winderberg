import { ContainerItem } from "shared/types/ContainerTypes";

export const inventoryContainerMaxWeight = 25;
export const trunkContainerMaxWeight = 80;

export const defaultInventoryItems: ContainerItem[] = [
	{
		name: "Testowy item",
		type: "Food",
		state: {
			weight: 1,
		},
	},
	{
		name: "Testowy item2",
		type: "Food",
		state: {
			weight: 1,
		},
	},
];
