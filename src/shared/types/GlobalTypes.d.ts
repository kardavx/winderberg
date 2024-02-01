type InitializerFunction = () => () => void;
type CharacterInitializerFunction = (character: Character) => () => void;

type Commands = ["say", "k", "s", "me", "do", "try", "b"];

type CommandsUnion = Commands[number];

interface CommandServerData {
	minRank?: number;
	darkens?: boolean;
	color?: Color3;
	range?: number;
	functionality: (
		sender: Player,
		validate: (sender: Player, message: string) => boolean,
		message: string[],
	) => string | undefined;
}

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
