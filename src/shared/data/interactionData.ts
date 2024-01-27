interface SubInteraction {
	name: string;
	icon?: string;
	functionality: (adornee: BasePart) => void;
}

interface Interactions {
	[interactionType: string]: SubInteraction[];
}

const interactionData: Interactions = {
	Test: [
		{
			name: "Wykonaj 1",
			icon: "rbxassetid://9086583856",
			functionality: (adornee: BasePart) => {
				print(`Hejka, jestem testowa podinterakcja numer 1!`);
			},
		},
		{
			name: "Wykonaj 2",
			functionality: (adornee: BasePart) => {
				print(`Hejka, jestem testowa podinterakcja numer 2!`);
			},
		},
	],
	Test2: [
		{
			name: "Wykonaj cos",
			functionality: (adornee: BasePart) => {
				print(`Hejka, jestem testowa podinterakcja numer 1!`);
			},
		},
		{
			name: "Wykonaj cos 2",
			functionality: (adornee: BasePart) => {
				print(`Hejka, jestem testowa podinterakcja numer 2!`);
			},
		},

		{
			name: "Wykonaj cos 3",
			functionality: (adornee: BasePart) => {
				print(`Hejka, jestem testowa podinterakcja numer 2!`);
			},
		},
	],
};

export const defaultIcon = "rbxassetid://7731404863";

export default interactionData;
