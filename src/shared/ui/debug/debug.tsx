import Roact from "@rbxts/roact";
import DebugButton from "./debugButton";
import Padding from "../components/base/Padding";
import OnKeyClicked from "shared/util/OnKeyClicked";
import { CommonProps } from "shared/types/UITypes";
import useProducerAsState from "../util/useProducerAsState";

export default (props: CommonProps) => {
	const [isShown, setIsShown] = Roact.useState(false);

	const [count] = useProducerAsState(props.clientState, (state) => {
		return state.count;
	});

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
				Text={tostring(count)}
				Callback={() => {
					(props.clientState.increment as () => void)();
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
