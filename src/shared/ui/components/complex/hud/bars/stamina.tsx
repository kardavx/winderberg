import Roact from "@rbxts/roact";
import Bar from "./bar";
import useProducerAsState from "shared/ui/hook/useProducerAsState";
import { CommonProps } from "shared/types/UITypes";
import palette from "shared/ui/palette/palette";

interface Props extends CommonProps {
	Size: number;
}

export default (props: Props) => {
	const [stamina] = useProducerAsState(props.clientState, (state) => state.stamina);

	return (
		<Bar
			icon="rbxassetid://858523021"
			iconXOffset={0.2}
			progress={stamina}
			Size={UDim2.fromScale(props.Size, 1)}
			BackgroundColor3={palette.Yellow}
		/>
	);
};
