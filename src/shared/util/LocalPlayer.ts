import { Players } from "@rbxts/services";

interface LocalPlayer extends Player {
	PlayerGui: PlayerGui;
	Backpack: Backpack;
}

export default Players.LocalPlayer as LocalPlayer;
