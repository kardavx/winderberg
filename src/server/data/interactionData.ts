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

const distanceBasedInteraction = (
	player: Player,
	adornee: AllowedInteractionInstances,
	maxDistance: number,
	closeCallback: () => void,
	producerSubscription: (cleanup: () => void) => () => void,
) => {
	const maid = new Maid();
	maid.GiveTask(
		serverSignals.onUpdate.Connect(() => {
			if (player.Character === undefined) closeCallback();
			if (!adornee.IsDescendantOf(Workspace)) closeCallback();
			if (isInteractionLocked(adornee)) closeCallback();

			const characterPosition = player.Character!.GetPivot().Position;
			const adorneePosition = adornee.IsA("Model") ? adornee.PrimaryPart!.Position : adornee.Position;
			const distance = characterPosition.sub(adorneePosition).Magnitude;
			if (distance > maxDistance) closeCallback();
		}),
	);
	maid.GiveTask(
		serverSignals.playerRemoving.Connect((leavingPlayer: Player) => leavingPlayer === player && maid.DoCleaning()),
	);
	maid.GiveTask(producerSubscription(() => maid.DoCleaning()));
};

const containerInteractions: SubInteractions = {
	Search: (player: Player, adornee: AllowedInteractionInstances) => {
		const containerId = adornee.GetAttribute("containerId") as number;
		if (containerId === undefined) return;

		const playerProfile = getPlayerProfile(player);
		if (!playerProfile) return;

		if (isInteractionLocked(adornee)) return;

		playerProfile.producer.secureOpenExternalContainer(containerId);
		distanceBasedInteraction(
			player,
			adornee,
			5,
			() => playerProfile.producer.closeExternalContainer(),
			(cleanup) =>
				playerProfile.producer.subscribe(
					(state) => state.externalContainerId,
					(containerId) => containerId === undefined && cleanup(),
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
	task.wait(1);
	network.ReceiveChatMessage.fire(
		targetPlayer,
		getServerDoText(
			`na dokumencie widnieje imię i nazwisko ${playerName}, urodzony XX.XX.XXXX w USA, dokument ważny jest do 01.06.2034`,
		),
	);
};

const manageAccount = (accountNumber: string, player: Player, adornee: AllowedInteractionInstances) => {
	const playerProfile = getPlayerProfile(player);
	if (!playerProfile) return;

	const profileState = playerProfile.producer.getState();
	if (profileState.usedBankAccountNumber !== undefined) return;

	playerProfile.producer.secureUseBankAccount(accountNumber);
	distanceBasedInteraction(
		player,
		adornee,
		5,
		() => playerProfile.producer.stopUsingBankAccount(),
		(cleanup) =>
			playerProfile.producer.subscribe(
				(state) => state.usedBankAccountNumber,
				(accountNumber) => accountNumber === undefined && cleanup(),
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
	ATM: {
		ManageAccount: (player: Player, adornee: AllowedInteractionInstances) => {
			const playerProfile = getPlayerProfile(player);
			if (!playerProfile) return;

			const profileState = playerProfile.producer.getState();
			if (profileState.bankAccountNumber === undefined) return;

			manageAccount(profileState.bankAccountNumber, player, adornee);
		},
	},
	BankClerk: {
		ManageAccount: (player: Player, adornee: AllowedInteractionInstances) => {
			const playerProfile = getPlayerProfile(player);
			if (!playerProfile) return;

			const profileState = playerProfile.producer.getState();
			if (profileState.bankAccountNumber === undefined) return;

			manageAccount(profileState.bankAccountNumber, player, adornee);
		},
		CreateAccount: (player: Player, adornee: AllowedInteractionInstances) => {
			const playerProfile = getPlayerProfile(player);
			if (!playerProfile) return;

			const profileState = playerProfile.producer.getState();
			if (profileState.bankAccountNumber !== undefined) return;
		},
		DeactivateAccount: (player: Player, adornee: AllowedInteractionInstances) => {
			const playerProfile = getPlayerProfile(player);
			if (!playerProfile) return;

			const profileState = playerProfile.producer.getState();
			if (profileState.bankAccountNumber === undefined) return;
		},
	},
};
