import { ItemType } from "shared/data/itemTypesData";
import { ContainerItem } from "shared/types/ContainerTypes";

export default (items: ContainerItem<ItemType>[]): number => {
	let weight = 0;
	items.forEach((item) => (weight += item.state.weight));
	return weight;
};
