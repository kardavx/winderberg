import Maid from "@rbxts/maid";
import serverData from "./module/serverData";
import { Players } from "@rbxts/services";
import serverSignals from "shared/signal/serverSignals";

const maid = new Maid();

game.BindToClose(() => {
	serverSignals.onClosing.Fire();
});

// TO WAZNE, TUTAJ MUSZA BYC, NIE POD CONNECTAMI EVENTOW BO SIE WYJEBIE NA PYSK

maid.GiveTask(serverData());

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
