import { clientProducer } from "shared/module/clientPlayerData";
import { icons } from "./notificationData";

interface SubInteraction {
	name: string;
	icon?: string;
	functionality: (adornee: BasePart) => void;
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
};

export const maxInteractionDistance = 15;
export const defaultIcon = "rbxassetid://7731404863";

export default interactionData;
