import Beacon from "@rbxts/beacon";

export default {
	onRender: new Beacon.Signal<number>(),
	playerDataLoaded: new Beacon.Signal<void>(),
	serverDataLoaded: new Beacon.Signal<void>(),
};
