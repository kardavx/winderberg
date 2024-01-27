import Maid from "@rbxts/maid";
import { RunService } from "@rbxts/services";
import clientInterface from "shared/module/clientInterface";
import gameSignals from "shared/signal/clientSignals";
import LocalPlayer from "shared/util/LocalPlayer";
import camera from "shared/module/camera/camera";
import movement from "shared/module/movement";
import cameraEffects from "shared/module/cameraEffects";
import clientPlayerData from "shared/module/clientPlayerData";

const maid = new Maid();
const characterMaid = new Maid();

const onCharacterAdded = (character: Character) => {
	characterMaid.DoCleaning();
	characterMaid.GiveTask(camera(character));
	characterMaid.GiveTask(cameraEffects(character));
	characterMaid.GiveTask(movement(character));
};

const onCharacterRemoving = () => {
	characterMaid.DoCleaning();
};

maid.GiveTask(() => characterMaid.DoCleaning());

maid.GiveTask(
	RunService.PreRender.Connect((deltaTime: number) => {
		gameSignals.onRender.Fire(deltaTime);
	}),
);

if (LocalPlayer.Character) onCharacterAdded(LocalPlayer.Character as Character);

maid.GiveTask(
	LocalPlayer.CharacterAdded.Connect((character: Model) => {
		onCharacterAdded(character as Character);
	}),
);

maid.GiveTask(
	LocalPlayer.CharacterRemoving.Connect(() => {
		onCharacterRemoving();
	}),
);

maid.GiveTask(clientPlayerData());
maid.GiveTask(clientInterface());
