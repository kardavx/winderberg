import Maid from "@rbxts/maid";
import { Players, Workspace } from "@rbxts/services";
import { getServerDoText } from "server/controller/chatApi";
import { getPlayerProfile } from "server/controller/serverData";
import getPlayerNameAndSurname from "server/util/getPlayerNameAndSurname";
import network from "shared/network/network";
import serverSignals from "shared/signal/serverSignals";
import { AllowedInteractionInstances } from "shared/ui/components/complex/interaction/interaction";
import isInteractionLocked from "shared/util/interaction/isInteractionLocked";

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

		if (isInteractionLocked(adornee)) return;

		const maid = new Maid();
		maid.GiveTask(
			serverSignals.onUpdate.Connect(() => {
				if (player.Character === undefined) playerProfile.producer.closeExternalContainer();
				if (!adornee.IsDescendantOf(Workspace)) playerProfile.producer.closeExternalContainer();
				if (isInteractionLocked(adornee)) playerProfile.producer.closeExternalContainer();

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

const carInteractions: SubInteractions = {
	Lock: (_, adornee: AllowedInteractionInstances) => {
		const carRef = adornee.FindFirstChild("Car") as ObjectValue;
		let actualAdornee: Instance;

		if (carRef) {
			actualAdornee = carRef.Value as Instance;
		} else {
			actualAdornee = adornee;
		}

		let desiredLockState: boolean;
		if (actualAdornee.GetAttribute("locked") === true) {
			desiredLockState = false;
		} else {
			desiredLockState = true;
		}

		actualAdornee.SetAttribute("locked", desiredLockState);
	},
};

const showDocument = (documentType: string) => (player: Player, adornee: AllowedInteractionInstances) => {
	if (!adornee.IsA("Model")) return;

	const targetPlayer = Players.GetPlayerFromCharacter(adornee);
	if (!targetPlayer) return;

	const playerName = getPlayerNameAndSurname(player);
	const targetPlayerName = getPlayerNameAndSurname(targetPlayer);
	serverSignals.mockPlayerMessage.Fire(
		player,
		`/me wyciąga z kieszeni portfel i pokazuje ${documentType} dla ${targetPlayerName}`,
	);
	task.wait(1)
	network.ReceiveChatMessage.fire(
		targetPlayer,
		getServerDoText(
			`na dokumencie widnieje imię i nazwisko ${playerName}, urodzony XX.XX.XXXX w USA, dokument ważny jest do 01.06.2034`,
		),
	);
};

export const serverInteractionData: Interactions = {
	CarTrunk: {
		...carInteractions,
		...containerInteractions,
	},
	Player: {
		showID: showDocument("Dokument tożsamości"),
		showDL: showDocument("Licencje kierowcy"),
	},
	CarDoor: {
		...carInteractions,
	},
};
