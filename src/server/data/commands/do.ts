import { Mocha } from "@rbxts/catppuccin";
import getPlayerNameAndSurname from "server/util/getPlayerNameAndSurname";

const doCommand: CommandServerData = {
	darkens: true,
	color: Mocha.Blue,
	functionality: (sender: Player, validate: (sender: Player, message: string) => boolean, message: string[]) => {
		const senderName = getPlayerNameAndSurname(sender);
		const sendersMessage = message.join(" ");

		if (!validate(sender, sendersMessage)) return;
		return `** ( ${senderName} ${sendersMessage} )`;
	},
};

export default doCommand;
