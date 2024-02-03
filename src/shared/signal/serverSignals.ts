import Beacon from "@rbxts/beacon";

export default {
	playerAdded: new Beacon.Signal<Player>(),
	playerRemoving: new Beacon.Signal<Player>(),
	characterAdded: new Beacon.Signal<[Player, Model]>(),
	characterRemoving: new Beacon.Signal<[Player, Model]>(),
	onUpdate: new Beacon.Signal<number>(),
	mockPlayerMessage: new Beacon.Signal<[Player, string]>(),
	sendMessageAt: new Beacon.Signal<[Vector3, string, number]>(),
	onClosing: new Beacon.Signal<void>(),
};
