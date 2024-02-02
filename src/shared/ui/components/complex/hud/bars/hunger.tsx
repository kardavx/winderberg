import Roact from "@rbxts/roact";
import Bar from "./bar";
import { CommonProps } from "shared/types/UITypes";
import useProducerAsState from "shared/ui/util/useProducerAsState";
import palette from "shared/ui/palette/palette";

interface Props extends CommonProps {
	Size: number;
}

export default (props: Props) => {
	const [hunger] = useProducerAsState(props.serverProfile, (state) => state.hunger);

	return (
		<Bar
			icon="rbxassetid://6493469433"
			iconXOffset={0}
			progress={hunger}
			Size={UDim2.fromScale(props.Size, 1)}
			BackgroundColor3={palette.Maroon}
		/>
	);
};
