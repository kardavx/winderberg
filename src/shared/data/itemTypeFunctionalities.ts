import { ContainerItem } from "shared/types/ContainerTypes";
import { ItemType, TypeStateSchema } from "./itemTypesData";
import Maid from "@rbxts/maid";
import { State } from "shared/reflex/serverState";

const itemTypeFunctionalities: {
	[itemType in ItemType]: (
		item: ContainerItem,
		slice: (state: State) => TypeStateSchema,
	) => [() => Promise<void>, Promise<void>] | void;
} = {
	Primary: (item: ContainerItem) => {
		const maid = new Maid();

		return [
			() =>
				new Promise((resolve) => {
					maid.DoCleaning();

					task.delay(2, resolve);
				}),
			new Promise((resolve) => {
				maid.GiveTask(() => {
					print("essa");
				});

				task.delay(2, resolve);
			}),
		];
	},
	Secondary: (item: ContainerItem) => {},
	Food: (item: ContainerItem) => {},
	Water: (item: ContainerItem) => {},
};

export default itemTypeFunctionalities;
