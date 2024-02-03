import { ValidateMessage } from "server/controller/chatApi";
import getPlayerNameAndSurname from "server/util/getPlayerNameAndSurname";
import palette from "shared/ui/palette/palette";

const results = ["sukces", "porażkę"];

const tryCommand: CommandServerData = {
	darkens: true,
	color: palette.Mauve,
	functionality: (sender: Player, validate: ValidateMessage, firedByServer: boolean, message: string[]) => {
		const senderName = getPlayerNameAndSurname(sender);
		const sendersMessage = message.join(" ");

		if (!validate(sender, sendersMessage, firedByServer)) return;
		return `* ${senderName} odniósł ${results[math.random(0, results.size() - 1)]} próbując ${sendersMessage}`;
	},
};

export default tryCommand;
