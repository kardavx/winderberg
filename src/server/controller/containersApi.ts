import Maid from "@rbxts/maid";
import network from "shared/network/network";
import { getPlayerProfile } from "./serverData";
import { transferItemToContainer } from "server/module/containers";

const containersApi: InitializerFunction = () => {
	const maid = new Maid();

	maid.GiveTask(
		network.TransferItem.connect((player, to, index) => {
			const playerProfile = getPlayerProfile(player);
			if (!playerProfile) return;

			const profileState = playerProfile.producer.getState();
			if (profileState.inventoryContainerId === undefined || profileState.externalContainerId === undefined)
				return;

			const transferFrom =
				to === "External" ? profileState.inventoryContainerId : profileState.externalContainerId;
			const transferTo = to === "External" ? profileState.externalContainerId : profileState.inventoryContainerId;

			transferItemToContainer(transferFrom, transferTo, index);
		}),
	);

	return () => maid.DoCleaning();
};

export default containersApi;
