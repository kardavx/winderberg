import Maid from "@rbxts/maid";
import serverSignals from "shared/signal/serverSignals";

export const playerInteractionBinder: InitializerFunction = () => {
	const maid = new Maid();

	maid.GiveTask(
		serverSignals.characterAdded.Connect((_, character: Model) => {
			character.SetAttribute("interactionType", "Player");
			character.AddTag("interaction");
		}),
	);

	return () => {
		maid.DoCleaning();
	};
};
