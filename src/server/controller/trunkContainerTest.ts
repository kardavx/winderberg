import { createContainer } from "server/module/containers";
import { trunkContainerMaxWeight } from "shared/data/containerData";
import network from "shared/network/network";
import { getPlayerProfile } from "./serverData";

const trunkContainerTest: InitializerFunction = () => {
	let containerId: number;

	createContainer(trunkContainerMaxWeight).andThen(
		(incomingContainerId: number) => (containerId = incomingContainerId),
	);

	const cleanup = network.OpenTrunk.connect((player: Player) => {
		const playerProfile = getPlayerProfile(player);
		if (!playerProfile) return;

		playerProfile.producer.secureOpenExternalContainer(containerId);
	});

	return () => cleanup();
};

export default trunkContainerTest;
