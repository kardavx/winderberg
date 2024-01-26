import Roact from "@rbxts/roact";
import useSpring from "shared/ui/hook/useSpring";
import FullscreenFrame from "../base/FullscreenFrame";
import Text from "../base/Text";

export default (props: CommonProps) => {
	const [transparencyFactor, setTransparencyFactor] = useSpring({
		initialValue: props.clientState.loading === true ? 0 : 1,
	});
	setTransparencyFactor(props.clientState.loading === true ? 0 : 1);

	return (
		<FullscreenFrame
			BackgroundColor3={new Color3(0, 0, 0)}
			BackgroundTransparency={transparencyFactor.map((factor: number) => factor)}
		>
			<uilistlayout
				VerticalAlignment={Enum.VerticalAlignment.Center}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
			/>

			<Text
				TextTransparency={transparencyFactor.map((factor: number) => factor)}
				Text="Ładowanie..."
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.5, 0.5)}
				TextSize={20}
				TextColor3={new Color3(1, 1, 1)}
			/>
		</FullscreenFrame>
	);
};
