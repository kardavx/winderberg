import { Mocha } from "@rbxts/catppuccin";

export default {
	errorColor: Mocha.Red,

	notFound: (commandName: string) => `Komenda /${commandName} nie istnieje!`,
	notPermitted: (commandName: string) => `Nie masz dostępu do komendy /${commandName}`,
	wasFiltered: () => `Twoja wiadomość została odrzucona przez filtr!`,
};
