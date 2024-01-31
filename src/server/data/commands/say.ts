import getPlayerNameAndSurname from "server/util/getPlayerNameAndSurname";
import attachPunctuationMark from "shared/util/attachPunctuationMark";
import uppercaseFirstLetter from "shared/util/uppercaseFirstLetter";

const say: CommandServerData = {
	darkens: true,
	functionality: (sender: Player, validate: (sender: Player, message: string) => boolean, message: string[]) => {
		const senderName = getPlayerNameAndSurname(sender);
		const sendersMessage = message.join(" ");

		if (!validate(sender, sendersMessage)) return;
		return attachPunctuationMark(`${senderName} mówi: ${uppercaseFirstLetter(sendersMessage)}`, ".");
	},
};

export default say;
