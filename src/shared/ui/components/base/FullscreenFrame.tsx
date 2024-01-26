import Roact from "@rbxts/roact";
import { GuiService } from "@rbxts/services";
import Padding from "./Padding";

interface Props extends Roact.JsxInstanceProperties<Frame>, Roact.PropsWithChildren {}

export default (props: Props) => {
	const [inset] = GuiService.GetGuiInset();

	return (
		<frame
			{...props}
			Size={new UDim2(1, 0, 1, inset.Y)}
			AnchorPoint={new Vector2(0.5, 1)}
			Position={UDim2.fromScale(0.5, 1)}
		>
			<Padding Size={6} />

			{props.children}
		</frame>
	);
};
