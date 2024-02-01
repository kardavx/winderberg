import Maid from "@rbxts/maid";
import { CollectionService, ContextActionService, RunService, UserInputService, Workspace } from "@rbxts/services";
import cameraModifier from "shared/class/cameraModifier";
import cameraConfig from "shared/config/cameraConfig";
import gameSignals from "shared/signal/clientSignals";
import CurrentCamera from "shared/util/CurrentCamera";
import OnKeyClicked from "shared/util/OnKeyClicked";
import lerpNumber from "shared/util/lerpNumber";
import { clientProducer } from "../clientPlayerData";
import ignoredRaycastTags from "shared/data/ignoredRaycastTags";
import roundVector from "shared/util/roundVector";
import unnanifyVector from "shared/util/unnanifyVector";
import OnKeyHeld from "shared/util/OnKeyHeld";

let moveDirection = Vector3.zero;

export const getMoveDirection = () => moveDirection;

const updateOrientation = (
	orientation: Vector2,
	inputState: Enum.UserInputState,
	inputObject: InputObject,
): Vector2 => {
	let newOrientation = new Vector2(orientation.X, orientation.Y);

	if (inputState === Enum.UserInputState.Change) {
		const xAngle = newOrientation.X - inputObject.Delta.X;
		const yAngle = math.clamp(newOrientation.Y - inputObject.Delta.Y * 0.4, -75, 75);

		newOrientation = new Vector2(xAngle, yAngle);
	}

	return newOrientation;
};

const getActualZOffset = (
	facing: CFrame,
	raycastParams: RaycastParams,
	targetZOffset: number,
	currentZOffset: number,
	deltaTime: number,
): number => {
	const raycastResult = Workspace.Blockcast(
		facing,
		new Vector3(0.4, 0.4, 0.1),
		facing.LookVector.mul(-targetZOffset),
		raycastParams,
	);

	if (raycastResult) {
		const amountToSubtract = targetZOffset - raycastResult.Distance;
		const newZOffset = targetZOffset - amountToSubtract;
		const slowPan = newZOffset > currentZOffset;

		return slowPan ? lerpNumber(currentZOffset, newZOffset, 6 * deltaTime) : newZOffset;
	}

	return lerpNumber(currentZOffset, targetZOffset, 6 * deltaTime);
};

const mouseUnlockedToBehavior = (mouseUnlocked: boolean): Enum.MouseBehavior => {
	return mouseUnlocked ? Enum.MouseBehavior.Default : Enum.MouseBehavior.LockCenter;
};

const camera: CharacterInitializerFunction = (character: Character) => {
	const maid = new Maid();

	const ignored: Instance[] = [];
	ignoredRaycastTags.forEach((tag: string) => {
		CollectionService.GetTagged(tag).forEach((tagged) => {
			ignored.push(tagged);
		});
	});

	const cameraObstructionParams = new RaycastParams();
	cameraObstructionParams.FilterDescendantsInstances = [character, CurrentCamera, ...ignored];
	cameraObstructionParams.IgnoreWater = false;
	cameraObstructionParams.FilterType = Enum.RaycastFilterType.Exclude;

	const zOffset = 6;
	let zOffsetMultiplierIndex = 0;

	let orientation = Vector2.zero;
	let currentZOffset = zOffset;

	const desiredOffset = new CFrame(1, 1, 0);
	let locked = false;

	maid.GiveTask(
		OnKeyClicked(
			"aim",
			() => {
				if (locked) {
					locked = false;
					clientProducer.removeLockEnabler("aim");
				} else {
					locked = true;
					clientProducer.addLockEnabler("aim");
				}
			},
			Enum.UserInputType.MouseButton2,
		),
	);

	maid.GiveTask(
		gameSignals.onRender.Connect((deltaTime: number) => {
			const currentState = clientProducer.getState();

			const isMouseUnlocked = currentState.mouseEnablers.size() > 0;
			const isCameraLocked = currentState.lockEnablers.size() > 0;

			UserInputService.MouseIconEnabled = isMouseUnlocked;

			if (CurrentCamera.CameraType !== Enum.CameraType.Scriptable) {
				CurrentCamera.CameraType = Enum.CameraType.Scriptable;
			}

			if (UserInputService.MouseBehavior !== mouseUnlockedToBehavior(isMouseUnlocked)) {
				UserInputService.MouseBehavior = mouseUnlockedToBehavior(isMouseUnlocked);
			}

			const cameraSubject = character.HumanoidRootPart.Position;
			const baseCFrame = new CFrame(cameraSubject).mul(
				CFrame.fromEulerAnglesYXZ(math.rad(orientation.Y), math.rad(orientation.X), 0),
			);

			if (isCameraLocked) {
				character.Humanoid.AutoRotate = false;
				moveDirection = roundVector(
					unnanifyVector(
						new CFrame(cameraSubject)
							.mul(CFrame.Angles(0, math.rad(orientation.X), 0))
							.VectorToObjectSpace(character.Humanoid.MoveDirection).Unit,
					),
				);
			} else {
				character.Humanoid.AutoRotate = true;
				moveDirection = new Vector3(0, 0, -math.sign(character.Humanoid.MoveDirection.Magnitude));
			}

			const offsetedCFrame = baseCFrame.mul(desiredOffset);
			const cframeWithModifiers = offsetedCFrame.mul(cameraModifier.getOffsets());

			currentZOffset = getActualZOffset(
				cframeWithModifiers.mul(new CFrame(0, -desiredOffset.Position.Y, 0)),
				cameraObstructionParams,
				zOffset * cameraConfig.zOffsetMultipliers[zOffsetMultiplierIndex],
				currentZOffset,
				deltaTime,
			);
			const ZoffsetedCFrame = cframeWithModifiers.mul(new CFrame(0, 0, currentZOffset));

			CurrentCamera.CFrame = ZoffsetedCFrame;
			CurrentCamera.Focus = ZoffsetedCFrame;
		}),
	);

	RunService.BindToRenderStep("UpdateAfterCharacter", Enum.RenderPriority.Character.Value + 1, () => {
		const currentState = clientProducer.getState();
		const isCameraLocked = currentState.lockEnablers.size() > 0;

		if (isCameraLocked) {
			character.PrimaryPart.CFrame = new CFrame(character.PrimaryPart.Position).mul(
				CFrame.Angles(0, math.rad(orientation.X), 0),
			);
		}
	});

	maid.GiveTask(() => RunService.UnbindFromRenderStep("UpdateAfterCharacter"));

	maid.GiveTask(
		OnKeyClicked(
			"offsetCamera",
			() => {
				if (cameraConfig.zOffsetMultipliers[zOffsetMultiplierIndex + 1] !== undefined) {
					zOffsetMultiplierIndex++;
				} else {
					zOffsetMultiplierIndex = 0;
				}
			},
			Enum.KeyCode.V,
		),
	);

	let cursorLocked = false;
	maid.GiveTask(
		OnKeyClicked(
			"unlockCursor",
			() => {
				if (cursorLocked) {
					cursorLocked = false;
					clientProducer.removeMouseEnabler("unlockCursor");
				} else {
					cursorLocked = true;
					clientProducer.addMouseEnabler("unlockCursor");
				}
			},
			Enum.KeyCode.Z,
		),
	);

	ContextActionService.BindAction(
		"cameraMouseDeltaProcess",
		(_, inputState: Enum.UserInputState, inputObject: InputObject) => {
			orientation = updateOrientation(orientation, inputState, inputObject);
		},
		false,
		Enum.UserInputType.MouseMovement,
		Enum.UserInputType.Touch,
	);

	maid.GiveTask(() => {
		ContextActionService.UnbindAction("cameraMouseDeltaProcess");
		CurrentCamera.CameraType = Enum.CameraType.Custom;
		UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
		UserInputService.MouseIconEnabled = true;
	});

	return () => {
		maid.DoCleaning();
	};
};

export default camera;
