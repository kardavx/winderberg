import { CommonProps } from "shared/types/UITypes";
import Text from "../../base/Text";
import Roact from "@rbxts/roact";
import Padding from "../../base/Padding";
import useProducerAsBinding from "shared/ui/hook/useProducerAsBinding";

export default (props: CommonProps) => {
	const [location] = useProducerAsBinding(props.serverProfile, (state) => state.location);

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
			<Padding Size={20} />
			<Text
				AnchorPoint={new Vector2(1, 1)}
				Position={UDim2.fromScale(1, 1)}
				Size={UDim2.fromScale(0.5, 0.015)}
				Weight="Bold"
				TextXAlignment={Enum.TextXAlignment.Right}
				Text={location.map((loc) => loc)}
			/>
		</frame>
	);
};
