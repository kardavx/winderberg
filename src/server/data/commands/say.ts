import { ValidateMessage } from "server/controller/chatApi";
import getPlayerNameAndSurname from "server/util/getPlayerNameAndSurname";
import attachPunctuationMark from "shared/util/attachPunctuationMark";
import uppercaseFirstLetter from "shared/util/uppercaseFirstLetter";

const say: CommandServerData = {
	darkens: true,
	functionality: (sender: Player, validate: ValidateMessage, firedByServer: boolean, message: string[]) => {
		const senderName = getPlayerNameAndSurname(sender);
		const sendersMessage = message.join(" ");

		if (!validate(sender, sendersMessage, firedByServer)) return;
		return attachPunctuationMark(`${senderName} mówi: ${uppercaseFirstLetter(sendersMessage)}`, ".");
	},
};

export default say;
