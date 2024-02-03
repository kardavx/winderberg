import { ValidateMessage } from "server/controller/chatApi";
import getPlayerNameAndSurname from "server/util/getPlayerNameAndSurname";
import palette from "shared/ui/palette/palette";

const b: CommandServerData = {
	color: palette.Overlay0,
	functionality: (sender: Player, validate: ValidateMessage, firedByServer: boolean, message: string[]) => {
		const senderName = getPlayerNameAndSurname(sender);
		const sendersMessage = message.join(" ");

		if (!validate(sender, sendersMessage, firedByServer)) return;
		return `(( ${senderName}: ${sendersMessage} ))`;
	},
};

export default b;
