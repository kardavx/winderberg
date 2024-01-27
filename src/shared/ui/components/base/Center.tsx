import Roact from "@rbxts/roact";

interface Props {
	FillDirection?: Enum.FillDirection;
	Padding?: UDim;
}

export default (props: Props) => {
	return (
		<uilistlayout
			FillDirection={props.FillDirection}
			Padding={props.Padding}
			HorizontalAlignment={Enum.HorizontalAlignment.Center}
			VerticalAlignment={Enum.VerticalAlignment.Center}
		/>
	);
};
