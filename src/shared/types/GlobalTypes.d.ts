type InitializerFunction = () => () => void;
type CharacterInitializerFunction = (character: Character) => () => void;

interface HumanoidWithAnimator extends Humanoid {
	Animator: Animator;
}

interface Character extends Model {
	PrimaryPart: BasePart;
	Humanoid: HumanoidWithAnimator;
	HumanoidRootPart: BasePart;

	UpperTorso: BasePart & {
		Waist: Motor6D;
	};
}
