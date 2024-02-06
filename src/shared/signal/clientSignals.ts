import { Signal } from "@rbxts/beacon";

export default {
	onRender: new Signal<number>(),
	playerDataLoaded: new Signal<void>(),
	serverDataLoaded: new Signal<void>(),

	// inventory
	handleItemEquip: new Signal<number>(),
};
