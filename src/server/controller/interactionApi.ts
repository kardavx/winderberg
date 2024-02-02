import Maid from "@rbxts/maid";
import { serverInteractionData } from "server/data/interactionData";
import network from "shared/network/network";

const interactionApi: InitializerFunction = () => {
	const maid = new Maid();

	maid.GiveTask(
		network.ReplicateInteraction.connect((player: Player, serverActionId: string, adornee: BasePart | Model) => {
			const interactionType = adornee.GetAttribute("interactionType") as string;
			if (!serverInteractionData[interactionType] || !serverInteractionData[interactionType][serverActionId])
				return;

			serverInteractionData[interactionType][serverActionId](player, adornee);
		}),
	);

	return () => maid.DoCleaning();
};

export default interactionApi;
