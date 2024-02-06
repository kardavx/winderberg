import { ContainerItem } from "shared/types/ContainerTypes";
import { ItemType } from "./itemTypesData";
import Maid from "@rbxts/maid";

type FunctionalityPromise = Promise<void>;

const itemTypeFunctionalities: {
	[itemType in ItemType]: (
		item: ContainerItem,
	) => LuaTuple<[() => FunctionalityPromise, FunctionalityPromise]> | void;
} = {
	Primary: (item: ContainerItem) => {
		const maid = new Maid();

		return $tuple(
			() =>
				new Promise((resolve, reject) => {
					maid.DoCleaning();
				}),
			new Promise((resolve, reject) => {
				maid.GiveTask(() => {
					print("essa");
				});

				resolve();
			}),
		);
	},
	Secondary: (item: ContainerItem) => {},
	Food: (item: ContainerItem) => {},
	Water: (item: ContainerItem) => {},
};
