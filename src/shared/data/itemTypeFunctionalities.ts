import { ContainerItem } from "shared/types/ContainerTypes";
import { ItemType } from "./itemTypesData";
import Maid from "@rbxts/maid";

const itemTypeFunctionalities: {
	[itemType in ItemType]: (item: ContainerItem) => [() => Promise<void>, Promise<void>] | void;
} = {
	Primary: (item: ContainerItem) => {
		const maid = new Maid();

		return [
			() =>
				new Promise((resolve) => {
					print(`unequipping ${item.name}`);
					task.delay(2, () => {
						maid.DoCleaning();
						resolve();
					});
				}),
			new Promise((resolve) => {
				maid.GiveTask(() => {
					print(`unequipped ${item.name}`);
				});

				print(`equipping ${item.name}`);
				task.delay(2, () => {
					print(`equipped ${item.name}`);
					resolve();
				});
			}),
		];
	},
	Secondary: (item: ContainerItem) => {
		const maid = new Maid();

		return [
			() =>
				new Promise((resolve) => {
					print(`unequipping ${item.name}`);
					task.delay(2, () => {
						maid.DoCleaning();
						resolve();
					});
				}),
			new Promise((resolve) => {
				maid.GiveTask(() => {
					print(`unequipped ${item.name}`);
				});

				print(`equipping ${item.name}`);
				task.delay(2, () => {
					print(`equipped ${item.name}`);
					resolve();
				});
			}),
		];
	},
	Food: (item: ContainerItem) => {
		print(`used ${item.name}`);
	},
	Water: (item: ContainerItem) => {
		print(`used ${item.name}`);
	},
};

export default itemTypeFunctionalities;
