import { createContainer } from "server/module/containers";
import { trunkContainerMaxWeight } from "shared/data/containerData";
import network from "shared/network/network";
import { getPlayerProfile, waitForServerState } from "./serverData";

const trunkContainerTest: InitializerFunction = () => {
	let containerId: number | undefined;

	waitForServerState().andThen((serverState) => {
		const producerState = serverState.producer.getState();
		if (producerState.carTrunkContainerId !== undefined) {
			containerId = producerState.carTrunkContainerId;
		} else {
			createContainer(trunkContainerMaxWeight).andThen((incomingContainerId: number) => {
				serverState.producer.setCarTrunkContainerId(incomingContainerId);
				containerId = incomingContainerId;
			});
		}
	});

	const cleanup = network.OpenTrunk.connect((player: Player) => {
		if (containerId === undefined) return;

		const playerProfile = getPlayerProfile(player);
		if (!playerProfile) return;

		playerProfile.producer.secureOpenExternalContainer(containerId);
	});

	return () => cleanup();
};

export default trunkContainerTest;
