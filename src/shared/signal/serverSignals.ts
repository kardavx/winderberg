import Beacon from "@rbxts/beacon";

export default {
	playerAdded: new Beacon.Signal<Player>(),
	playerRemoving: new Beacon.Signal<Player>(),
	onClosing: new Beacon.Signal<void>(),
};
