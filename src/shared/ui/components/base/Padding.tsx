import Roact from "@rbxts/roact";
import getViewportScaledUdim from "shared/ui/util/getViewportScaledUdim";

interface Props {
	Size: number;
}

export default (props: Props) => {
	return (
		<uipadding
			PaddingTop={getViewportScaledUdim(props.Size)}
			PaddingBottom={getViewportScaledUdim(props.Size)}
			PaddingLeft={getViewportScaledUdim(props.Size)}
			PaddingRight={getViewportScaledUdim(props.Size)}
		/>
	);
};
