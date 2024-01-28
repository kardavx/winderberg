import Roact from "@rbxts/roact";
import CurrentCamera from "shared/util/CurrentCamera";

interface Props extends Roact.JsxInstanceProperties<TextLabel>, Roact.PropsWithChildren {
	TextSize?: number;
	TextScaled?: boolean;
	CustomTextScaled?: boolean;
	Weight?: "Regular" | "Bold";
}

const weightToFont = {
	Regular: Enum.Font.Gotham,
	Bold: Enum.Font.GothamBold,
};

const calculateSize = (pxSize: number) => {
	return (pxSize * CurrentCamera.ViewportSize.X) / 1920;
};

export default (props: Props) => {
	const textSize = props.TextSize !== undefined ? props.TextSize : 14;
	const resolution = { ...(props.CustomTextScaled && { TextScaled: false, TextSize: calculateSize(textSize) }) };
	const properties = { ...props, Weight: undefined, CustomTextScaled: undefined };
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
			{props.children}
		</textlabel>
	);
};
