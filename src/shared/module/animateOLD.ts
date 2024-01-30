// import Maid from "@rbxts/maid";
// import clientSignals from "shared/signal/clientSignals";
// import loadAnimations from "shared/util/loadAnimations";
// import { getMoveDirection } from "./camera/camera";

// const movementAnimations = {
// 	Idle: 16162737790,
// 	WalkForward: 16162741819,
// 	WalkBackward: 16162741819,
// 	WalkRight: 16162743675,
// 	WalkLeft: 16162748371,
// };

// const fadeTime = 0.2;
// const disabledWeightValue = 0.00001;

// const adjustParamsAndPlay = (animationTrack: AnimationTrack, weight: number = 1, speed: number = 1) => {
// 	if (!animationTrack.IsPlaying) animationTrack.Play(0, disabledWeightValue, speed);

// 	animationTrack.AdjustWeight(weight, fadeTime);
// 	animationTrack.AdjustSpeed(speed);
// };

// const animate: CharacterInitializerFunction = (character: Character) => {
// 	const maid = new Maid();

// 	const [animations, animationCleanup] = loadAnimations(
// 		movementAnimations,
// 		character.Humanoid.Animator,
// 		(animationTrack) => {
// 			animationTrack.Play(0, 0.01, 0);
// 		},
// 	);

// 	maid.GiveTask(animationCleanup);
// 	maid.GiveTask(
// 		clientSignals.onRender.Connect((deltaTime: number) => {
// 			const moveDirection = getMoveDirection();

// 			const forward = moveDirection.Z;
// 			const side = moveDirection.X;

// 			const walkingX = math.abs(side) > 0;
// 			const walkingZ = math.abs(forward) > 0;

// 			const isForward = forward <= 0;

// const speed =
// 	math.max(character.PrimaryPart.AssemblyLinearVelocity.Magnitude, character.Humanoid.WalkSpeed) / 12;
// 			const state = character.Humanoid.GetState();

// 			if (
// 				character.PrimaryPart.AssemblyLinearVelocity.Magnitude > 1 &&
// 				state === Enum.HumanoidStateType.Running
// 			) {
// 				adjustParamsAndPlay(animations.Idle, disabledWeightValue, 1);

// 				if (!animations.WalkForward.IsPlaying) {
// 					animations.WalkForward.Play(0, 0.01, 0);
// 					animations.WalkRight.Play(0, 0.01, 0);
// 					animations.WalkLeft.Play(0, 0.01, 0);
// 				}

// 				if (forward < 0) {
// 					adjustParamsAndPlay(animations.WalkForward, 1, speed * (isForward ? 1 : -1));
// 				} else {
// 					adjustParamsAndPlay(animations.WalkForward, disabledWeightValue, speed * (isForward ? 1 : -1));
// 				}

// 				if ((isForward && side > 0) || (!isForward && side < 0)) {
// 					adjustParamsAndPlay(animations.WalkRight, 1, speed);
// 				} else {
// 					adjustParamsAndPlay(animations.WalkRight, disabledWeightValue, speed);
// 				}

// 				if ((isForward && side < 0) || (!isForward && side > 0)) {
// 					adjustParamsAndPlay(animations.WalkLeft, 1, speed);
// 				} else {
// 					adjustParamsAndPlay(animations.WalkLeft, disabledWeightValue, speed);
// 				}
// 			} else {
// 				adjustParamsAndPlay(animations.Idle, 1, 1);
// 				adjustParamsAndPlay(animations.WalkForward, disabledWeightValue, speed);
// 				adjustParamsAndPlay(animations.WalkRight, disabledWeightValue, speed);
// 				adjustParamsAndPlay(animations.WalkLeft, disabledWeightValue, speed);
// 			}
// 		}),
// 	);

// 	return () => {
// 		maid.DoCleaning();
// 	};
// };

// export default animate;
