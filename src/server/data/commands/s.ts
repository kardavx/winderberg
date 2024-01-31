import getPlayerNameAndSurname from "server/util/getPlayerNameAndSurname";
import ranges from "./ranges";
import uppercaseFirstLetter from "shared/util/uppercaseFirstLetter";
import attachPunctuationMark from "shared/util/attachPunctuationMark";

const s: CommandServerData = {
	darkens: true,
	range: ranges.Far,
	functionality: (sender: Player, validate: (sender: Player, message: string) => boolean, message: string[]) => {
		const senderName = getPlayerNameAndSurname(sender);
		const sendersMessage = message.join(" ");

		if (!validate(sender, sendersMessage)) return;
		return attachPunctuationMark(`${senderName} szepcze: ${uppercaseFirstLetter(sendersMessage)}`, ".");
	},
};

export default s;
