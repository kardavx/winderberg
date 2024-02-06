import { ConfigItem } from "shared/types/ContainerTypes";

export type ItemName = ["test_jedzenie", "test_primary", "test_secondary"];

const itemData: { [itemName in ItemName[number]]: ConfigItem } = {
	test_jedzenie: {
		name: "Brajan Burger",
		type: "Food",
		state: {},
	},
	test_primary: {
		name: "AR-15",
		type: "Primary",
		state: {},
	},
	test_secondary: {
		name: "Glock-17",
		type: "Secondary",
		state: {},
	},
};

export default itemData;
