import Maid from "@rbxts/maid";
import cameraModifier from "shared/class/cameraModifier";
import gameSignals from "shared/signal/clientSignals";

const effectStrength = 0.025;

const cameraEffects: CharacterInitializerFunction = (character: Character) => {
	const maid = new Maid();
	const torsoTransformModifier = cameraModifier.create(true);

	maid.GiveTask(() => {
		torsoTransformModifier.destroy();
	});

	maid.GiveTask(
		gameSignals.onRender.Connect((deltaTime: number) => {
			const upperTorsoTransform = character.UpperTorso.Waist.Transform;
			const [x, y, z] = upperTorsoTransform.ToOrientation();
			torsoTransformModifier.set(CFrame.Angles(x * effectStrength, y * effectStrength, z * effectStrength));
		}),
	);

	return () => {
		maid.DoCleaning();
	};
};

export default cameraEffects;
