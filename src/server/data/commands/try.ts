import { Mocha } from "@rbxts/catppuccin";
import getPlayerNameAndSurname from "server/util/getPlayerNameAndSurname";

const results = ["sukces", "porażkę"];

const tryCommand: CommandServerData = {
	darkens: true,
	color: Mocha.Mauve,
	functionality: (sender: Player, validate: (sender: Player, message: string) => boolean, message: string[]) => {
		const senderName = getPlayerNameAndSurname(sender);
		const sendersMessage = message.join(" ");

		if (!validate(sender, sendersMessage)) return;
		return `* ${senderName} odniósł ${results[math.random(0, results.size() - 1)]} próbując ${sendersMessage}`;
	},
};

export default tryCommand;