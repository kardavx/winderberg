import Roact, { Fragment } from "@rbxts/roact";
import Loading from "./components/complex/loading";
import Debug from "./debug/debug";
import { ClientProducer } from "shared/reflex/clientState";
import { ProfileProducer } from "shared/reflex/serverProfile";
import { ServerProducer } from "shared/reflex/serverState";
import { CommonProps } from "shared/types/UITypes";
import Menu from "./components/complex/menu/menu";
import Interaction from "./components/complex/interaction/interaction";
import reactConditional from "./util/reactConditional";

export default (props: {
	clientState: ClientProducer;
	serverProfile?: ProfileProducer;
	serverState?: ServerProducer;
}) => {
	const isLoaded = props.serverProfile !== undefined && props.serverState !== undefined;

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
			{reactConditional(
				isLoaded,
				<Fragment>
					<Debug {...(props as CommonProps)} />
					<Interaction {...(props as CommonProps)} />
					{/* <Menu {...(props as CommonProps)} /> */}
				</Fragment>,
			)}

			<Loading loading={!isLoaded}></Loading>
		</frame>
	);
};
