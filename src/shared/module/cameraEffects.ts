import Maid from "@rbxts/maid";
import cameraModifier from "shared/class/cameraModifier";
import gameSignals from "shared/signal/clientSignals";

const effectStrength = 0.1;

const cameraEffects: CharacterInitializerFunction = (character: Character) => {
	const maid = new Maid();
	const torsoTransformModifier = cameraModifier.create(true);

	maid.GiveTask(() => {
		torsoTransformModifier.destroy();
	});

	maid.GiveTask(
		gameSignals.onRender.Connect((deltaTime: number) => {
			if (character.HumanoidRootPart) {
				const upperTorsoTransform = character.HumanoidRootPart.RootJoint.Transform;
				const [x, y, z] = upperTorsoTransform.ToOrientation();
				torsoTransformModifier.set(CFrame.Angles(x * effectStrength, y * effectStrength, z * effectStrength));
			} else {
				torsoTransformModifier.set(CFrame.identity);
			}
		}),
	);

	return () => {
		maid.DoCleaning();
	};
};

export default cameraEffects;
