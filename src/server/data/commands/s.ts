import getPlayerNameAndSurname from "server/util/getPlayerNameAndSurname";
import ranges from "./ranges";
import uppercaseFirstLetter from "shared/util/uppercaseFirstLetter";
import attachPunctuationMark from "shared/util/attachPunctuationMark";
import { ValidateMessage } from "server/controller/chatApi";

const s: CommandServerData = {
	darkens: true,
	range: ranges.Far,
	functionality: (sender: Player, validate: ValidateMessage, firedByServer: boolean, message: string[]) => {
		const senderName = getPlayerNameAndSurname(sender);
		const sendersMessage = message.join(" ");

		if (!validate(sender, sendersMessage, firedByServer)) return;
		return attachPunctuationMark(`${senderName} szepcze: ${uppercaseFirstLetter(sendersMessage)}`, ".");
	},
};

export default s;
