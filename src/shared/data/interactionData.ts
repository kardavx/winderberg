import { clientProducer } from "shared/module/clientPlayerData";
import { icons } from "./notificationData";
import { AllowedInteractionInstances } from "shared/ui/components/complex/interaction/interaction";

interface SubInteraction {
	name: string;
	icon?: string;
	functionality: (adornee: AllowedInteractionInstances) => void;
}

interface Interactions {
	[interactionType: string]: SubInteraction[];
}

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
};

export const maxInteractionDistance = 15;
export const defaultIcon = "rbxassetid://7731404863";

export default interactionData;
