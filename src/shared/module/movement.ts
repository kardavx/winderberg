import Maid from "@rbxts/maid";
import OnKeyHeld from "shared/util/OnKeyHeld";

const walkSpeed = 8;
const runSpeed = 16;

const movement: CharacterInitializerFunction = (character: Character) => {
	const maid = new Maid();

	character.Humanoid.WalkSpeed = walkSpeed;

	maid.GiveTask(
		OnKeyHeld(
			"Run",
			(isKeyHeld: boolean) => {
				character.Humanoid.WalkSpeed = isKeyHeld ? runSpeed : walkSpeed;
			},
			Enum.KeyCode.LeftShift,
		),
	);

	return () => {
		maid.DoCleaning();
	};
};

export default movement;
