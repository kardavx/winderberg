import Roact from "@rbxts/roact";
import getViewportScaledNumber from "shared/ui/util/getViewportScaledNumber";
import Stroke from "./Stroke";
import palette from "shared/ui/palette/palette";

interface Props extends Roact.JsxInstanceProperties<TextButton>, Roact.PropsWithChildren {
	TextSize?: number;
	TextScaled?: boolean;
	Callback: () => void;
	CustomTextScaled?: boolean;
	Stroke?: number;
	Weight?: "Regular" | "Bold";
}

export const weightToFont = {
	Regular: Enum.Font.Gotham,
	Bold: Enum.Font.GothamBold,
};

export default (props: Props) => {
	const textSize = props.TextSize !== undefined ? props.TextSize : 14;
	const strokeSize = props.Stroke !== undefined ? props.Stroke : 0;

	const resolution = {
		...(props.CustomTextScaled && { TextScaled: false, TextSize: getViewportScaledNumber(textSize) }),
	};
	const properties = {
		...props,
		Weight: undefined,
		CustomTextScaled: undefined,
		Stroke: undefined,
		Callback: undefined,
	};
	const weight = props.Weight !== undefined ? props.Weight : "Regular";

	return (
		<textbutton
			TextScaled={true}
			RichText={true}
			AutoButtonColor={false}
			TextColor3={palette.Text}
			BackgroundColor3={palette.Base}
			Font={weightToFont[weight]}
			{...properties}
			{...resolution}
			Event={{
				MouseButton1Click: () => props.Callback(),
			}}
		>
			<uitextsizeconstraint MaxTextSize={props.TextSize} />
			<Stroke Thickness={strokeSize} Color={new Color3(0, 0, 0)} />
			{props.children}
		</textbutton>
	);
};
