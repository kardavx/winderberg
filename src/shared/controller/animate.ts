import Maid from "@rbxts/maid";
import clientSignals from "shared/signal/clientSignals";
import loadAnimations from "shared/util/loadAnimations";

const animationList = {
	Idle: 16223351246,
	WalkForward: 16223347742,
	WalkRight: 16223343231,
	WalkLeft: 16223338653,
	Jump: 16223329648,
	Fall: 16223333788,
	Climb: 16223318147,
	Landed: 16223321462,
	Seat: 16223314578,
	DriverSeat: 16223310341,
	PassengerSeat: 16223305076,
};

const fadeTime = 0.2;
const disabledWeightValue = 0.001;

const animate: CharacterInitializerFunction = (character: Character) => {
	const maid = new Maid();

	const [animations, animationCleanup] = loadAnimations(animationList, character.Humanoid.Animator);

	maid.GiveTask(
		character.Humanoid.StateChanged.Connect(
			(oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) => {
				if (newState === Enum.HumanoidStateType.Jumping) animations.Jump.Play(fadeTime / 2);
				if (oldState === Enum.HumanoidStateType.FallingDown || oldState === Enum.HumanoidStateType.Freefall)
					animations.Fall.Stop(fadeTime);
				if (newState === Enum.HumanoidStateType.FallingDown || newState === Enum.HumanoidStateType.Freefall)
					animations.Fall.Play();
				if (newState === Enum.HumanoidStateType.Landed) animations.Landed.Play(fadeTime);
				if (oldState === Enum.HumanoidStateType.Climbing) animations.Climb.Stop(fadeTime);
				if (newState === Enum.HumanoidStateType.Climbing)
					animations.Climb.Play(
						fadeTime,
						1,
						math.clamp(character.PrimaryPart.AssemblyLinearVelocity.Magnitude, 0, 1),
					);
				if (newState === Enum.HumanoidStateType.Seated) {
					const seatPart = character.Humanoid.SeatPart as Seat;
					if (seatPart.GetAttribute("carSeatType") === "Driver") {
						animations.DriverSeat.Play(fadeTime);
					} else if (seatPart.GetAttribute("carSeatType") === "Passenger") {
						animations.PassengerSeat.Play(fadeTime);
					} else {
						animations.Seat.Play(fadeTime);
					}
				}
				if (oldState === Enum.HumanoidStateType.Seated) {
					animations.Seat.Stop(fadeTime);
					animations.DriverSeat.Stop(fadeTime);
					animations.PassengerSeat.Stop(fadeTime);
				}
			},
		),
	);

	animations.Idle.Play(0, disabledWeightValue, 0);
	animations.WalkForward.Play(0, disabledWeightValue, 0);
	animations.WalkRight.Play(0, disabledWeightValue, 0);
	animations.WalkLeft.Play(0, disabledWeightValue, 0);

	maid.GiveTask(animationCleanup);
	maid.GiveTask(
		clientSignals.onRender.Connect((deltaTime: number) => {
			const DirectionOfMovement = character.HumanoidRootPart.CFrame.VectorToObjectSpace(
				character.HumanoidRootPart.AssemblyLinearVelocity.mul(new Vector3(1, 0, 1)),
			);

			const Forward = math.abs(
				math.clamp(DirectionOfMovement.Z / character.Humanoid.WalkSpeed, -0.8, -disabledWeightValue),
			);
			const Backwards = math.abs(
				math.clamp(DirectionOfMovement.Z / character.Humanoid.WalkSpeed, disabledWeightValue, 0.8),
			);
			const Right = math.abs(
				math.clamp(DirectionOfMovement.X / character.Humanoid.WalkSpeed, disabledWeightValue, 1),
			);
			const Left = math.abs(
				math.clamp(DirectionOfMovement.X / character.Humanoid.WalkSpeed, -1, -disabledWeightValue),
			);

			const speed =
				math.max(character.PrimaryPart.AssemblyLinearVelocity.Magnitude, character.Humanoid.WalkSpeed) / 12;
			const state = character.Humanoid.GetState();

			if (animations.Climb.IsPlaying) {
				animations.Climb.AdjustSpeed(math.clamp(character.PrimaryPart.AssemblyLinearVelocity.Magnitude, 0, 1));
			}

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
