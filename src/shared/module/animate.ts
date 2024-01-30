import Maid from "@rbxts/maid";
import clientSignals from "shared/signal/clientSignals";
import loadAnimations from "shared/util/loadAnimations";

const movementAnimations = {
	Idle: 16162737790,
	WalkForward: 16162741819,
	WalkBackward: 16162741819,
	WalkRight: 16162743675,
	WalkLeft: 16162748371,
};

const fadeTime = 0.2;
const disabledWeightValue = 0.001;

const animate: CharacterInitializerFunction = (character: Character) => {
	const maid = new Maid();

	const [animations, animationCleanup] = loadAnimations(
		movementAnimations,
		character.Humanoid.Animator,
		(animationTrack) => {
			animationTrack.Play(0, disabledWeightValue, 0);
		},
	);

	maid.GiveTask(animationCleanup);
	maid.GiveTask(
		clientSignals.onRender.Connect((deltaTime: number) => {
			const DirectionOfMovement = character.HumanoidRootPart.CFrame.VectorToObjectSpace(
				character.HumanoidRootPart.AssemblyLinearVelocity,
			);

			const Forward = math.abs(math.clamp(DirectionOfMovement.Z / character.Humanoid.WalkSpeed, -0.8, -0.01));
			const Backwards = math.abs(math.clamp(DirectionOfMovement.Z / character.Humanoid.WalkSpeed, 0.01, 0.8));
			const Right = math.abs(math.clamp(DirectionOfMovement.X / character.Humanoid.WalkSpeed, 0.01, 1));
			const Left = math.abs(math.clamp(DirectionOfMovement.X / character.Humanoid.WalkSpeed, -1, -0.01));

			const speed =
				math.max(character.PrimaryPart.AssemblyLinearVelocity.Magnitude, character.Humanoid.WalkSpeed) / 12;
			const state = character.Humanoid.GetState();

			if (state === Enum.HumanoidStateType.Running) {
				if (DirectionOfMovement.Z / character.Humanoid.WalkSpeed < 0.1) {
					animations.WalkForward.AdjustWeight(Forward, fadeTime);
					animations.WalkRight.AdjustWeight(Right, fadeTime);
					animations.WalkLeft.AdjustWeight(Left, fadeTime);

					animations.WalkForward.AdjustSpeed(speed);
					animations.WalkRight.AdjustSpeed(speed);
					animations.WalkLeft.AdjustSpeed(speed);

					animations.Idle.AdjustWeight(disabledWeightValue, fadeTime);
				} else {
					animations.WalkForward.AdjustWeight(Backwards, fadeTime);
					animations.WalkRight.AdjustWeight(Left, fadeTime);
					animations.WalkLeft.AdjustWeight(Right, fadeTime);

					animations.WalkForward.AdjustSpeed(speed * -1);
					animations.WalkRight.AdjustSpeed(speed * -1);
					animations.WalkLeft.AdjustSpeed(speed * -1);

					animations.Idle.AdjustWeight(disabledWeightValue, fadeTime);
				}
			} else {
				animations.WalkForward.AdjustWeight(disabledWeightValue, fadeTime);
				animations.WalkRight.AdjustWeight(disabledWeightValue, fadeTime);
				animations.WalkLeft.AdjustWeight(disabledWeightValue, fadeTime);
			}

			if (DirectionOfMovement.Magnitude < 0.1) {
				animations.Idle.AdjustWeight(1, fadeTime);
			}
		}),
	);

	return () => {
		maid.DoCleaning();
	};
};

export default animate;
