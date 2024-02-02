import Roact from "@rbxts/roact";
import getViewportScaledNumber from "shared/ui/util/getViewportScaledNumber";
import Stroke from "./Stroke";

interface Props extends Roact.JsxInstanceProperties<TextLabel>, Roact.PropsWithChildren {
	TextSize?: number;
	TextScaled?: boolean;
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
	const properties = { ...props, Weight: undefined, CustomTextScaled: undefined, Stroke: undefined };
	const weight = props.Weight !== undefined ? props.Weight : "Regular";

	return (
		<textlabel
			TextScaled={true}
			RichText={true}
			BackgroundTransparency={1}
			Font={weightToFont[weight]}
			{...properties}
			{...resolution}
		>
			<uitextsizeconstraint MaxTextSize={props.TextSize} />
			<Stroke Thickness={strokeSize} Color={new Color3(0, 0, 0)} />
			{props.children}
		</textlabel>
	);
};
