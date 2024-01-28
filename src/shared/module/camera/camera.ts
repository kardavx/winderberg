import Maid from "@rbxts/maid";
import { ContextActionService, UserInputService, Workspace } from "@rbxts/services";
import cameraModifier from "shared/class/cameraModifier";
import cameraConfig from "shared/config/cameraConfig";
import gameSignals from "shared/signal/clientSignals";
import CurrentCamera from "shared/util/CurrentCamera";
import OnKeyClicked from "shared/util/OnKeyClicked";
import lerpNumber from "shared/util/lerpNumber";
import { clientProducer } from "../clientPlayerData";

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
		new Vector3(0.1, 0.1, 0.1),
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

	const cameraObstructionParams = new RaycastParams();
	cameraObstructionParams.FilterDescendantsInstances = [character, CurrentCamera];
	cameraObstructionParams.IgnoreWater = false;
	cameraObstructionParams.FilterType = Enum.RaycastFilterType.Exclude;

	const zOffset = 6;
	let zOffsetMultiplierIndex = 0;

	let orientation = Vector2.zero;
	let currentZOffset = zOffset;

	const desiredOffset = new CFrame(1, 1, 0);

	maid.GiveTask(
		gameSignals.onRender.Connect((deltaTime: number) => {
			const currentState = clientProducer.getState();
			const isMouseUnlocked = currentState.mouseEnablers.size() > 0;

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
			CurrentCamera.Focus = baseCFrame;
		}),
	);

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
