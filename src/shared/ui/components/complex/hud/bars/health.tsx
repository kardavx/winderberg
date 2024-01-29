import Roact from "@rbxts/roact";
import Bar from "./bar";
import { Mocha } from "@rbxts/catppuccin";
import LocalPlayer from "shared/util/LocalPlayer";
import Maid from "@rbxts/maid";

interface Props {
	Size: number;
}

export default (props: Props) => {
	let initialHealth = 100;
	if (LocalPlayer.Character) {
		initialHealth = (LocalPlayer.Character as Character).Humanoid.Health;
	}

	const [health, setHealth] = Roact.useState(initialHealth);

	Roact.useEffect(() => {
		const maid = new Maid();

		const character = LocalPlayer.Character as Character;

		if (character) {
			maid.GiveTask(
				character.Humanoid.GetPropertyChangedSignal("Health").Connect(() => {
					setHealth(character.Humanoid.Health);
				}),
			);
		}

		return () => {
			maid.DoCleaning();
		};
	});

	return (
		<Bar
			icon="rbxassetid://13780996931"
			iconXOffset={0.2}
			progress={health}
			Size={UDim2.fromScale(props.Size, 1)}
			BackgroundColor3={Mocha.Green}
		/>
	);
};
