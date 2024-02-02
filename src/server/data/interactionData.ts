import Maid from "@rbxts/maid";
import { Workspace } from "@rbxts/services";
import { getPlayerProfile } from "server/controller/serverData";
import serverSignals from "shared/signal/serverSignals";
import { AllowedInteractionInstances } from "shared/ui/components/complex/interaction/interaction";

interface SubInteractions {
	[serverActionId: string]: (player: Player, adornee: AllowedInteractionInstances) => void;
}

interface Interactions {
	[interactionType: string]: SubInteractions;
}

export const maxDistanceToContainer = 10;

const containerInteractions: SubInteractions = {
	Search: (player: Player, adornee: AllowedInteractionInstances) => {
		const containerId = adornee.GetAttribute("containerId") as number;
		if (containerId === undefined) return;

		const playerProfile = getPlayerProfile(player);
		if (!playerProfile) return;

		const maid = new Maid();
		maid.GiveTask(
			serverSignals.onUpdate.Connect(() => {
				if (player.Character === undefined) playerProfile.producer.closeExternalContainer();
				if (!adornee.IsDescendantOf(Workspace)) playerProfile.producer.closeExternalContainer();

				const characterPosition = player.Character!.GetPivot().Position;
				const adorneePosition = adornee.IsA("Model") ? adornee.PrimaryPart!.Position : adornee.Position;
				const distance = characterPosition.sub(adorneePosition).Magnitude;
				if (distance > maxDistanceToContainer) playerProfile.producer.closeExternalContainer();
			}),
		);
		maid.GiveTask(
			serverSignals.playerRemoving.Connect(
				(leavingPlayer: Player) => leavingPlayer === player && maid.DoCleaning(),
			),
		);
		playerProfile.producer.secureOpenExternalContainer(containerId);
		maid.GiveTask(
			playerProfile.producer.subscribe(
				(state) => state.externalContainerId,
				(containerId) => containerId === undefined && maid.DoCleaning(),
			),
		);
	},
};

export const serverInteractionData: Interactions = {
	CarTrunk: {
		...containerInteractions,
	},
};
