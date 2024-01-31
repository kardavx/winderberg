import Maid from "@rbxts/maid";
import { lerp } from "@rbxts/pretty-react-hooks";
import commands from "server/data/commands";
import errors from "server/data/commands/errors";
import ranges from "server/data/commands/ranges";
import wasMessageFiltered from "server/util/wasMessageFiltered";
import network from "shared/network/network";
import attachRichTextColor from "shared/util/attachRichTextColor";
import clampedInverseLerp from "shared/util/clampedInverseLerp";
import getPlayersInRange from "shared/util/getPlayersInRange";
import hasPrefix from "shared/util/hasPrefix";

type CommmandCheckResult = "Command" | "CommandNotFound";

const checkForCommand = (message: string): LuaTuple<[CommmandCheckResult, string?, string[]?]> => {
	if (!hasPrefix(message)) return $tuple("Command", "say", message.split(" "));

	const messageWithoutPrefix = message.sub(2);
	const splitMessage: string[] = messageWithoutPrefix.split(" ");
	const commandName = (splitMessage.remove(0) as string).lower();

	if (commands[commandName as CommandsUnion] === undefined) return $tuple("CommandNotFound", commandName);

	return $tuple("Command", commandName, splitMessage);
};

const getColor = (
	color: Color3 = new Color3(1, 1, 1),
	darkens: boolean = false,
	distance: number,
	range: number,
): Color3 => {
	if (darkens) {
		const [H, S, V] = color.ToHSV();

		const distanceFactor = clampedInverseLerp(0, range, distance);
		const scaledValue = lerp(V, 0.1, distanceFactor);

		return Color3.fromHSV(H, S, scaledValue);
	}

	return color;
};

const validateMessage = (sender: Player, message: string): boolean => {
	const [filtered, filteredMessage] = wasMessageFiltered(message, sender.UserId);

	if (filtered) {
		network.ReceiveChatMessage.fire(
			sender,
			attachRichTextColor(errors.wasFiltered(filteredMessage as string), errors.errorColor),
		);
		return false;
	}

	return true;
};

const chatApi: InitializerFunction = () => {
	const maid = new Maid();

	maid.GiveTask(
		network.SendChatMessage.connect((player: Player, message: string) => {
			if (!player.Character) return;
			const [commandCheckResult, commandName, commandParams] = checkForCommand(message);

			if (commandCheckResult === "CommandNotFound") {
				network.ReceiveChatMessage.fire(
					player,
					attachRichTextColor(errors.notFound(commandName as string), errors.errorColor),
				);
			}

			if (commandCheckResult === "Command") {
				const commandData = commands[commandName as CommandsUnion];

				if (commandData.minRank !== undefined) {
					if (player.GetRankInGroup(0) < commandData.minRank) {
						network.ReceiveChatMessage.fire(
							player,
							attachRichTextColor(errors.notFound(commandName as string), errors.errorColor),
						);
						return;
					}
				}

				const commandResult = commandData.functionality(player, validateMessage, commandParams as string[]);
				if (commandResult !== undefined) {
					const range = commandData.range !== undefined ? commandData.range : ranges.Normal;
					const fullColorRange = range - range / 3;
					const playersInRange = getPlayersInRange(player.Character.GetPivot().Position, range);

					playersInRange.forEach(({ player, distance }) => {
						const messageColor = getColor(commandData.color, commandData.darkens, distance, fullColorRange);
						network.ReceiveChatMessage.fire(player, attachRichTextColor(commandResult, messageColor));
					});
				}
			}
		}),
	);

	return () => maid.DoCleaning();
};

export default chatApi;
