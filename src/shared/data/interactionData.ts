import { clientProducer } from "shared/controller/clientPlayerData";
import { icons } from "./notificationData";
import { AllowedInteractionInstances } from "shared/ui/components/complex/interaction/interaction";
import LocalPlayer from "shared/util/LocalPlayer";

interface SubInteraction {
	name: string;
	icon?: string;
	serverActionId?: string;
	validator?: (adornee: AllowedInteractionInstances) => boolean;
	functionality?: (adornee: AllowedInteractionInstances) => void;
}

interface Interactions {
	[interactionType: string]: SubInteraction[];
}

const carInteractions: SubInteraction[] = [
	{
		name: "Otwórz",
		functionality: () => {
			print("otwiraj");
		},
	},
	{
		name: "Zaklucz",
		functionality: () => {
			print("zakluczaj to");
		},
	},
];

const interactionData: Interactions = {
	ATM: [
		{
			name: "Wypłać",
			icon: icons.money,
			functionality: () => {
				clientProducer.pushNotification({
					title: "Bank",
					description: `Wypłaciłes 100$ z konta`,
					icon: "money",
				});
			},
		},
		{
			name: "Wpłać",
			icon: icons.money,
			functionality: () => {
				clientProducer.pushNotification({
					title: "Bank",
					description: `Wpłaciłes 100$ na konto`,
					icon: "money",
				});
			},
		},
		{
			name: "Okradnij",
			icon: icons.crime,
			functionality: () => {
				clientProducer.pushNotification({
					title: "rabunek",
					description: `Obrabowałeś bankomat pomyślnie, otrzymujesz 430$`,
					icon: "crime",
				});
			},
		},
	],
	Car: [
		{
			name: "Ukradnij",
			icon: icons.crime,
			functionality: () => {
				clientProducer.pushNotification({
					title: "Rabunek",
					description: `Zostaw to auto zlodzieju!!!`,
					icon: "crime",
				});
			},
		},
	],
	Player: [
		{
			name: "Pokaż ID",
			functionality: () => {
				print("pokazuje");
			},
		},
		{
			name: "Pokaż licencje kierowcy",
			functionality: () => {
				print("pokazuje");
			},
		},
	],
	CarDoor: [
		{
			name: "Wsiądź",
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
			serverActionId: "Search",
		},
		...carInteractions,
	],
};

export const maxInteractionDistance = 15;
export const defaultIcon = "rbxassetid://7731404863";

export default interactionData;
