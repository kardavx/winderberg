import Roact from "@rbxts/roact";
import DebugButton from "./debugButton";
import Padding from "../components/base/Padding";
import OnKeyClicked from "shared/util/OnKeyClicked";
import { CommonProps } from "shared/types/UITypes";
import useProducerAsState from "../util/useProducerAsState";

export default (props: CommonProps) => {
	const [isShown, setIsShown] = Roact.useState(false);

	if (isShown) {
		props.clientState.addMouseEnabler("debug");
	} else {
		props.clientState.removeMouseEnabler("debug");
	}

	const [clientCount] = useProducerAsState(props.clientState, (state) => {
		return state.count;
	});

	const [profileCount] = useProducerAsState(props.serverProfile, (state) => {
		return state.count;
	});

	const [profileTest] = useProducerAsState(props.serverProfile, (state) => {
		return state.test;
	});

	const [serverCount] = useProducerAsState(props.serverState, (state) => {
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
				Text={tostring(clientCount)}
				Callback={() => {
					props.clientState.increment();
				}}
			/>
			<DebugButton
				Text={`${profileTest}_${tostring(profileCount)}`}
				Callback={() => {
					props.serverProfile.increment();
				}}
			/>
			<DebugButton
				Text={tostring(serverCount)}
				Callback={() => {
					props.serverState.increment();
				}}
			/>
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
						description:
							"Essa",
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
