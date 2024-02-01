import Roact from "@rbxts/roact";
import DynamicCanvas from "./DynamicCanvas";
import useSpring from "shared/ui/hook/useSpring";

interface Props extends Roact.PropsWithChildren {
	Visible: boolean;
	HiddenSize?: UDim2;
	Size: UDim2;
}

export default (props: Props) => {
	const [shownFactor, setShownFactor] = useSpring({ initialValue: 0, stiffness: 80, dampening: 20 });
	setShownFactor(props.Visible ? 1 : 0);

	return (
		<DynamicCanvas
			Static={shownFactor.map((factor: number) => factor < 0.01)}
			Visible={shownFactor.map((factor: number) => factor > 0.01)}
			GroupTransparency={shownFactor.map((factor: number) => 1 - factor)}
			Size={shownFactor.map((factor: number) => {
				return (props.HiddenSize !== undefined ? props.HiddenSize : props.Size).Lerp(props.Size, factor);
			})}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={shownFactor.map((factor: number) => {
				return UDim2.fromScale(0.5, 0.7).Lerp(UDim2.fromScale(0.5, 0.5), factor);
			})}
			BackgroundTransparency={1}
		>
			{props.children}
		</DynamicCanvas>
	);
};
