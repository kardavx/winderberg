import Maid from "@rbxts/maid";
import { MessagingService, Players, TeleportService } from "@rbxts/services";

interface Data {
	serverId: string;
	code: string;
	playersOnline: number;
	maxPlayers: number;
}

const queueHandler: InitializerFunction = () => {
	const maid = new Maid();

	function publishMessage() {
		const toSend: Data = {
			serverId: game.JobId,
			code: TeleportService.GetTeleportSetting("code") as string,
			playersOnline: Players.GetPlayers().size(),
			maxPlayers: 50,
		};

		MessagingService.PublishAsync("Servers", toSend);
	}

	function playerAdded(player: Player) {
		const serverId = TeleportService.GetTeleportSetting("Server");
		if (serverId !== undefined) {
			if (serverId !== game.JobId) {
				player.Kick("Wrong server, how did you get in here?");
			}
		} else {
			TeleportService.SetTeleportSetting("Server", game.JobId);
		}
	}

	maid.GiveTask(() => {
		const loopEnabled = true;

		while (loopEnabled) {
			publishMessage();

			task.wait(5);
		}
	});
	maid.GiveTask(Players.PlayerAdded.Connect(playerAdded));

	return () => maid.DoCleaning();
};

export default queueHandler;
