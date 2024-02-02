import Roact, { Fragment } from "@rbxts/roact";
import Loading from "./components/complex/loading";
import Debug from "./debug/debug";
import { ClientProducer } from "shared/reflex/clientState";
import { ProfileProducer } from "shared/reflex/serverProfile";
import { ServerProducer } from "shared/reflex/serverState";
import { CommonProps } from "shared/types/UITypes";
import Interaction from "./components/complex/interaction/interaction";
import reactConditional from "./util/reactConditional";
import HudRouter from "./components/complex/hud/hudRouter";
import CurrentCamera from "shared/util/CurrentCamera";
import clientSignals from "shared/signal/clientSignals";
import Inventory from "./components/complex/inventory/inventory";
import Menu from "./components/complex/menu/menu";
import Maid from "@rbxts/maid";
import LocalPlayer from "shared/util/LocalPlayer";

export default (props: {
	clientState: ClientProducer;
	serverProfile?: ProfileProducer;
	serverState?: ServerProducer;
}) => {
	const isLoaded = props.serverProfile !== undefined && props.serverState !== undefined;

	const [viewportSize, setViewportSize] = Roact.useState(CurrentCamera.ViewportSize);
	const [character, setCharacter] = Roact.useState(undefined as Character | undefined);

	const commonProps = { ...props, viewportSize, character } as CommonProps;

	Roact.useEffect(() => {
		const maid = new Maid();

		if (LocalPlayer.Character && character === undefined) setCharacter(LocalPlayer.Character as Character);
		maid.GiveTask(LocalPlayer.CharacterAdded.Connect((character) => setCharacter(character as Character)));
		maid.GiveTask(LocalPlayer.CharacterRemoving.Connect(() => setCharacter(undefined)));

		maid.GiveTask(
			clientSignals.onRender.Connect((deltaTime: number) => {
				const newSize = CurrentCamera.ViewportSize;
				if (viewportSize === newSize) return;

				setViewportSize(newSize);
			}),
		);

		return () => maid.DoCleaning();
	});

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
			{reactConditional(
				isLoaded,
				<Fragment>
					<Debug {...commonProps} />
					<Interaction {...commonProps} />
					<HudRouter {...commonProps} />
					<Inventory {...commonProps} />
					{/* <Menu {...commonProps} /> */}
				</Fragment>,
			)}

			<Loading loading={!isLoaded}></Loading>
		</frame>
	);
};
