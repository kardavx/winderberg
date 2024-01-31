import Maid from "@rbxts/maid";
import clientSignals from "shared/signal/clientSignals";
import OnKeyHeld from "shared/util/OnKeyHeld";
import { getMoveDirection } from "./camera/camera";
import { lerp } from "@rbxts/pretty-react-hooks";
import { clientProducer } from "./clientPlayerData";
import clampedInverseLerp from "shared/util/clampedInverseLerp";
import OnKeyClicked from "shared/util/OnKeyClicked";

const walkSpeed = 8;
const runSpeed = 16;

// te wartosci sa skalowane przez deltatime jeszcze jkbc
const staminaUsage = 10;
const staminaReplenish = 5;

const jumpCooldown = 2;
const jumpStaminaUsage = 5;

const movement: CharacterInitializerFunction = (character: Character) => {
	const maid = new Maid();

	let runRequest = false;

	let targetWalkspeed = walkSpeed;
	let limitReached = false;

	let nextJumpTick = tick();
	let hasJumped = false;

	character.Humanoid.WalkSpeed = targetWalkspeed;

	maid.GiveTask(
		OnKeyHeld(
			"Run",
			(isKeyHeld: boolean) => {
				runRequest = isKeyHeld;
			},
			Enum.KeyCode.LeftShift,
		),
	);

	maid.GiveTask(
		OnKeyClicked(
			"CustomJump",
			() => {
				if (tick() < nextJumpTick || limitReached === true || hasJumped === true) return;

				print(limitReached);
				hasJumped = true;
				character.Humanoid.ChangeState(Enum.HumanoidStateType.Jumping);
			},
			Enum.KeyCode.Space,
		),
	);

	maid.GiveTask(
		character.Humanoid.StateChanged.Connect((_, newValue: Enum.HumanoidStateType) => {
			if (newValue === Enum.HumanoidStateType.Landed) {
				hasJumped = false;
				nextJumpTick = tick() + jumpCooldown;
			}
			if (newValue === Enum.HumanoidStateType.Jumping) clientProducer.removeStamina(jumpStaminaUsage);
		}),
	);

	const performRun = (deltaTime: number) => {
		const state = clientProducer.getState();

		targetWalkspeed = runSpeed;
		clientProducer.removeStamina(
			staminaUsage *
				state.staminaUsageMultiplier *
				clampedInverseLerp(walkSpeed, runSpeed, character.Humanoid.WalkSpeed) *
				deltaTime,
		);
		if (state.stamina < 1) limitReached = true;
	};

	const performWalk = (deltaTime: number) => {
		const state = clientProducer.getState();

		targetWalkspeed = walkSpeed;
		clientProducer.addStamina(staminaReplenish * deltaTime);
		if (state.stamina >= 75) limitReached = false;
	};

	maid.GiveTask(
		clientSignals.onRender.Connect((deltaTime: number) => {
			const canRun = getMoveDirection().Z === -1;
			const isMoving = character.PrimaryPart.AssemblyLinearVelocity.Magnitude > 0;
			if (isMoving) {
				if (!limitReached) {
					if (canRun && runRequest) {
						performRun(deltaTime);
					} else {
						performWalk(deltaTime);
					}
				} else {
					performWalk(deltaTime);
				}

				character.Humanoid.WalkSpeed = lerp(character.Humanoid.WalkSpeed, targetWalkspeed, 2 * deltaTime);
			} else {
				performWalk(deltaTime);
				character.Humanoid.WalkSpeed = targetWalkspeed;
			}
		}),
	);

	return () => {
		maid.DoCleaning();
	};
};

export default movement;
