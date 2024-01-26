import Roact from "@rbxts/roact";
import DebugButton from "./debugButton";
import Padding from "../components/base/Padding";
import OnKeyClicked from "shared/util/OnKeyClicked";

export default (props: CommonProps) => {
	const [isShown, setIsShown] = Roact.useState(true);

	Roact.useEffect(() => {
		const cleanup = OnKeyClicked("handleDebugMenu", () => setIsShown(!isShown), Enum.KeyCode.F2);

		return () => {
			cleanup();
		};
	});

	return (
		<frame
			Visible={isShown}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(0.5, 0.4)}
			BackgroundColor3={new Color3(0, 0, 0)}
			BackgroundTransparency={0.4}
		>
			<uilistlayout Padding={new UDim(0, 10)} />
			<Padding Size={10} />

			<DebugButton
				Text="testowy przycisk"
				Callback={() => {
					print("testowy przycisk clicked!");
				}}
			/>
			<DebugButton
				Text="testowy przycisk"
				Callback={() => {
					print("testowy przycisk clicked!");
				}}
			/>
			<DebugButton
				Text="testowy przycisk"
				Callback={() => {
					print("testowy przycisk clicked!");
				}}
			/>
		</frame>
	);
};
