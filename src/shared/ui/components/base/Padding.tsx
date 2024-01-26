import Roact from "@rbxts/roact";

interface Props {
	Size: number;
}

export default (props: Props) => {
	return (
		<uipadding
			PaddingTop={new UDim(0, props.Size)}
			PaddingBottom={new UDim(0, props.Size)}
			PaddingLeft={new UDim(0, props.Size)}
			PaddingRight={new UDim(0, props.Size)}
		/>
	);
};
