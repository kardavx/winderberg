import Roact from "@rbxts/roact";

interface Props extends Roact.JsxInstanceProperties<TextLabel>, Roact.PropsWithChildren {
	TextSize?: number;
	Weight?: "Regular" | "Bold";
}

const weightToFont = {
	Regular: Enum.Font.Gotham,
	Bold: Enum.Font.GothamBold,
};

export default (props: Props) => {
	const properties = { ...props, Weight: undefined };
	const weight = props.Weight !== undefined ? props.Weight : "Regular";

	return (
		<textlabel
			TextScaled={true}
			RichText={true}
			BackgroundTransparency={1}
			Font={weightToFont[weight]}
			{...properties}
		>
			<uitextsizeconstraint MaxTextSize={props.TextSize} />
			{props.children}
		</textlabel>
	);
};
