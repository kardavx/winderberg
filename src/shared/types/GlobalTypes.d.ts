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
		validate: (sender: Player, message: string, firedByServer: boolean) => boolean,
		firedByServer: boolean,
		message: string[],
	) => string | undefined;
}

type withCallSignature = {
	[key in string]: (...args: unknown[]) => void;
};

interface HumanoidWithAnimator extends Humanoid {
	Animator: Animator;
}

interface Workspace extends Workspace {
	ignore: Folder & {
		Streets: Folder;
		Postals: Folder;
		Districts: Folder;
	};
}

interface Character extends Model {
	PrimaryPart: BasePart;
	Humanoid: HumanoidWithAnimator;
	HumanoidRootPart: BasePart & {
		RootJoint: Motor6D;
	};

	Torso: BasePart;
	Head: BasePart;
}

interface LocalPlayer extends Player {
	PlayerGui: PlayerGui;
}
