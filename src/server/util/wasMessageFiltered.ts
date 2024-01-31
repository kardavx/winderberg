import { TextService } from "@rbxts/services";

export default (message: string, senderId: number): [boolean, string?] => {
	const [suc, result] = pcall(() => TextService.FilterStringAsync(message, senderId));
	if (suc && result) {
		const filteredMessage = result.GetChatForUserAsync(senderId);
		return [filteredMessage !== message, filteredMessage];
	}

	return [true, message];
};
