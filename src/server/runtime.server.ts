import Maid from "@rbxts/maid";
import serverData from "./controller/serverData";
import { Players } from "@rbxts/services";
import serverSignals from "shared/signal/serverSignals";
import chatApi from "./controller/chatApi";
import playerBinder from "./controller/playerBinder";

const maid = new Maid();
const characterMaids: { [name: string]: Maid } = {};

game.BindToClose(() => {
	serverSignals.onClosing.Fire();
});

// TO WAZNE, TUTAJ MUSZA BYC, NIE POD CONNECTAMI EVENTOW BO SIE WYJEBIE NA PYSK
maid.GiveTask(serverData());
maid.GiveTask(chatApi());
maid.GiveTask(playerBinder());
// TO WAZNE, TUTAJ MUSZA BYC, NIE POD CONNECTAMI EVENTOW BO SIE WYJEBIE NA PYSK

maid.GiveTask(
	serverSignals.playerAdded.Connect((player: Player) => {
		if (characterMaids[player.Name]) {
			characterMaids[player.Name].DoCleaning();
			delete characterMaids[player.Name];
		}

		const characterMaid = new Maid();
		if (player.Character) serverSignals.characterAdded.Fire(player, player.Character);

		characterMaid.GiveTask(
			player.CharacterAdded.Connect((character: Model) => {
				serverSignals.characterAdded.Fire(player, character);
			}),
		);

		characterMaid.GiveTask(
			player.CharacterRemoving.Connect((character: Model) => {
				serverSignals.characterRemoving.Fire(player, character);
			}),
		);

		characterMaids[player.Name] = characterMaid;
	}),
);

maid.GiveTask(
	serverSignals.playerRemoving.Connect((player: Player) => {
		if (characterMaids[player.Name]) {
			characterMaids[player.Name].DoCleaning();
			delete characterMaids[player.Name];
		}
	}),
);

Players.GetPlayers().forEach((player: Player) => {
	serverSignals.playerAdded.Fire(player);
});

maid.GiveTask(
	Players.PlayerAdded.Connect((player: Player) => {
		serverSignals.playerAdded.Fire(player);
	}),
);

maid.GiveTask(
	Players.PlayerRemoving.Connect((player: Player) => {
		serverSignals.playerRemoving.Fire(player);
	}),
);
