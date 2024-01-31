import { TextService } from "@rbxts/services";

export default (message: string, senderId: number): boolean => {
	const [suc, result] = pcall(() => TextService.FilterStringAsync(message, senderId));
	if (suc && result) {
		return result.GetChatForUserAsync(senderId) !== message;
	}

	return true;
};
