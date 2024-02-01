import Roact from "@rbxts/roact";
import DebugButton from "./debugButton";
import Padding from "../components/base/Padding";
import OnKeyClicked from "shared/util/OnKeyClicked";
import { CommonProps } from "shared/types/UITypes";

export default (props: CommonProps) => {
	const [isShown, setIsShown] = Roact.useState(false);

	if (isShown) {
		props.clientState.addMouseEnabler("debug");
	} else {
		props.clientState.removeMouseEnabler("debug");
	}

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
			ZIndex={100}
			BackgroundColor3={new Color3(0, 0, 0)}
			BackgroundTransparency={0.4}
		>
			<uilistlayout Padding={new UDim(0, 10)} />
			<Padding Size={10} />

			<DebugButton
				Text={"Push test notification"}
				Callback={() => {
					props.clientState.pushNotification({
						title: "DEBUG",
						description:
							"To jest testowe powiadomienie mające na celu przetestowania czegoś, chuj ci w dupe łukasz",
						icon: "crime",
						callback: () => {
							print("i was clicked!");
						},
					});
				}}
			/>
			<DebugButton
				Text={"Push test notification"}
				Callback={() => {
					props.clientState.pushNotification({
						title: "DEBUG",
						description:
							"To jest testowe powiadomienie mające na celu przetestowania czegoś, chuj ci w dupe łukasz lorem ipsum lorem ipsum lorem ipsum  lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum",
						icon: "crime",
						callback: () => {
							print("i was clicked!");
						},
					});
				}}
			/>
			<DebugButton
				Text={"Push test notification"}
				Callback={() => {
					props.clientState.pushNotification({
						title: "DEBUG",
						description: "Essa",
						icon: "crime",
						callback: () => {
							print("i was clicked!");
						},
					});
				}}
			/>
		</frame>
	);
};
