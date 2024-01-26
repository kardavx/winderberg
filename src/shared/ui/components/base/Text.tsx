import Roact from "@rbxts/roact";

interface Props extends Roact.JsxInstanceProperties<TextLabel>, Roact.PropsWithChildren {
	TextSize?: number;
}

export default (props: Props) => {
	const properties = { ...props, TextSize: undefined };

	return (
		<textlabel TextScaled={true} {...properties}>
			<uitextsizeconstraint MaxTextSize={props.TextSize} />
		</textlabel>
	);
};
