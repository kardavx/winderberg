type InitializerFunction = () => () => void;
type CharacterInitializerFunction = (character: Character) => () => void;

type withCallSignature = {
	[key in string]: (...args: unknown[]) => void;
};

interface HumanoidWithAnimator extends Humanoid {
	Animator: Animator;
}

interface Character extends Model {
	PrimaryPart: BasePart;
	Humanoid: HumanoidWithAnimator;
	HumanoidRootPart: BasePart & {
		RootJoint: Motor6D;
	};

	Torso: BasePart;
}
