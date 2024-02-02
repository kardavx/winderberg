import Maid from "@rbxts/maid";
import { safeFallHeight } from "shared/data/fallDamageData";
import network from "shared/network/network";

const fallDamage: CharacterInitializerFunction = (character: Character) => {
	const maid = new Maid();

	let fallingStartYPos: number | undefined;
	maid.GiveTask(
		character.Humanoid.StateChanged.Connect((oldState, newState) => {
			if (newState === Enum.HumanoidStateType.FallingDown || newState === Enum.HumanoidStateType.Freefall) {
				fallingStartYPos = character.GetPivot().Position.Y;
			}

			if (oldState === Enum.HumanoidStateType.FallingDown || oldState === Enum.HumanoidStateType.Freefall) {
				if (fallingStartYPos === undefined) return;

				const distanceComparsion = fallingStartYPos - character.GetPivot().Position.Y;
				fallingStartYPos = undefined;
				if (distanceComparsion < 0 || distanceComparsion < safeFallHeight) return;

				network.OnPlayerFell.fire(distanceComparsion);
			}
		}),
	);

	return () => maid.DoCleaning();
};

export default fallDamage;
