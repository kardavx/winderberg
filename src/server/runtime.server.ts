import network from "shared/network/network";

network.TestReplicate.connect((player: Player, message) => {
	print(message);
});
