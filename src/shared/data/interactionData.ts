import { getServerProfile } from "shared/controller/clientPlayerData";
import { AllowedInteractionInstances } from "shared/ui/components/complex/interaction/interaction";
import LocalPlayer from "shared/util/LocalPlayer";
import isInteractionLocked from "shared/util/interaction/isInteractionLocked";

export interface SubInteraction {
	name: string | ((adornee: AllowedInteractionInstances) => string);
	icon?: string;
	serverActionId?: string;
	validator?: (adornee: AllowedInteractionInstances) => boolean;
	functionality?: (adornee: AllowedInteractionInstances) => void;
}

export interface Interactions {
	[interactionType: string]: SubInteraction[];
}

const notLockedValidator = (adornee: AllowedInteractionInstances) => {
	if (isInteractionLocked(adornee) === true) {
		return false;
	}

	return true;
};

const lockedText = (lockedText: string, unlockedText: string) => (adornee: AllowedInteractionInstances) => {
	if (isInteractionLocked(adornee) === true) {
		return lockedText;
	}

	return unlockedText;
};

const carInteractions: SubInteraction[] = [
	{
		name: "Otwórz",
		validator: notLockedValidator,
		functionality: () => {
			print("otwiraj");
		},
	},
	{
		name: lockedText("Odklucz", "Zaklucz"),
		serverActionId: "Lock",
	},
];

const sharedBankInteractions: SubInteraction[] = [
	{
		name: "Zarządzaj kontem",
		serverActionId: "ManageAccount",
		validator: (adornee: AllowedInteractionInstances) => {
			const serverProfile = getServerProfile();
			if (!serverProfile) return false;

			if (serverProfile.getState().bankAccountNumber === undefined) return false;

			return true;
		},
	},
];

const interactionData: Interactions = {
	ATM: [...sharedBankInteractions],
	BankClerk: [
		...sharedBankInteractions,
		{
			name: "Załóż konto",
			validator: (adornee: AllowedInteractionInstances) => {
				const serverProfile = getServerProfile();
				if (!serverProfile) return false;

				if (serverProfile.getState().bankAccountNumber !== undefined) return false;

				return true;
			},
			serverActionId: "CreateAccount",
		},
		{
			name: "Deaktywuj konto",
			validator: (adornee: AllowedInteractionInstances) => {
				const serverProfile = getServerProfile();
				if (!serverProfile) return false;

				if (serverProfile.getState().bankAccountNumber === undefined) return false;

				return true;
			},
			serverActionId: "DeactivateAccount",
		},
	],
	Player: [
		{
			name: "Pokaż ID",
			serverActionId: "showID",
		},
		{
			name: "Pokaż licencje kierowcy",
			serverActionId: "showDL",
		},
	],
	CarDoor: [
		{
			name: "Wsiądź",
			validator: notLockedValidator,
			functionality: (doorModel) => {
				const model = doorModel as Model;
				const value = model.FindFirstChild("To") as ObjectValue;
				const seat = value.Value as Seat;
				seat.Disabled = false;

				seat.Sit((LocalPlayer.Character as Character).Humanoid);
			},
		},
		...carInteractions,
	],
	CarTrunk: [
		{
			name: "Przeszukaj",
			validator: notLockedValidator,
			serverActionId: "Search",
		},
		...carInteractions,
	],
};

export const maxInteractionDistance = 15;
export const defaultIcon = "rbxassetid://7731404863";

export default interactionData;
