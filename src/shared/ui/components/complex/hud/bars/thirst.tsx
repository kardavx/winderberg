import Roact from "@rbxts/roact";
import Bar from "./bar";
import { Mocha } from "@rbxts/catppuccin";
import { CommonProps } from "shared/types/UITypes";
import useProducerAsState from "shared/ui/util/useProducerAsState";

interface Props extends CommonProps {
	Size: number;
}

export default (props: Props) => {
	const [thirst] = useProducerAsState(props.serverProfile, (state) => state.thirst);

	return (
		<Bar
			icon="rbxassetid://13492318033"
			iconXOffset={0}
			progress={100}
			Size={UDim2.fromScale(props.Size, 1)}
			BackgroundColor3={Mocha.Blue}
		/>
	);
};
