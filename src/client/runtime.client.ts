import Maid from "@rbxts/maid";
import { RunService, StarterGui } from "@rbxts/services";
import clientInterface from "shared/controller/clientInterface";
import gameSignals from "shared/signal/clientSignals";
import LocalPlayer from "shared/util/LocalPlayer";
import camera from "shared/controller/camera/camera";
import movement from "shared/controller/movement";
import cameraEffects from "shared/controller/cameraEffects";
import clientPlayerData from "shared/controller/clientPlayerData";
import animate from "shared/controller/animate";
import fallDamage from "shared/controller/fallDamage";
import nametagCreator from "shared/controller/nametagCreator";

StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.All, false);

const maid = new Maid();
const characterMaid = new Maid();

const onCharacterAdded = (character: Character) => {
	characterMaid.DoCleaning();

	character.WaitForChild("HumanoidRootPart");
	character.WaitForChild("Humanoid");

	characterMaid.GiveTask(camera(character));
	characterMaid.GiveTask(animate(character));
	characterMaid.GiveTask(fallDamage(character));
	characterMaid.GiveTask(cameraEffects(character));
	characterMaid.GiveTask(movement(character));
	characterMaid.GiveTask(nametagCreator());
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
