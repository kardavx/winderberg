import palette from "shared/ui/palette/palette";

export default {
	errorColor: palette.Red,

	notFound: (commandName: string) => `Komenda /${commandName} nie istnieje!`,
	notPermitted: (commandName: string) => `Nie masz dostępu do komendy /${commandName}`,
	wasFiltered: (result: string) => `Twoja wiadomość została odrzucona przez filtr! Rezultat: ${result}`,
};
