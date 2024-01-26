import Roact from "@rbxts/roact";
import Loading from "./components/complex/loading";
import Debug from "./debug/debug";

export default (props: CommonProps) => {
	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
			<Debug {...props} />
			<Loading {...props}></Loading>
		</frame>
	);
};
