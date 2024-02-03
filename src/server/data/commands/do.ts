import { ValidateMessage } from "server/controller/chatApi";
import getPlayerNameAndSurname from "server/util/getPlayerNameAndSurname";
import palette from "shared/ui/palette/palette";

const doCommand: CommandServerData = {
	darkens: true,
	color: palette.Blue,
	functionality: (sender: Player, validate: ValidateMessage, firedByServer: boolean, message: string[]) => {
		const senderName = getPlayerNameAndSurname(sender);
		const sendersMessage = message.join(" ");

		if (!validate(sender, sendersMessage, firedByServer)) return;
		return `** ( ${senderName} ${sendersMessage} )`;
	},
};

export default doCommand;
