import ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { setTimeout } from "@rbxts/set-timeout";
import { CreateProducer as CreateClientProducer, defaultState as defaultClientState } from "shared/reflex/clientState";
import {
	CreateProducer as CreateProfileProducer,
	defaultState as defaultProfileState,
} from "shared/reflex/serverProfile";
import { CreateProducer as CreateServerProducer, defaultState as defaultServerState } from "shared/reflex/serverState";
import { RouterProps } from "shared/types/UITypes";
import GameRouter from "shared/ui/gameRouter";
import LocalPlayer from "shared/util/LocalPlayer";

const renderRouter = (root: ReactRoblox.Root, props: RouterProps) => {
	root.render(Roact.createElement(GameRouter, props));
};

const clientInterface: InitializerFunction = () => {
	const container = new Instance("ScreenGui");
	container.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
	container.Name = "Client";
	container.Parent = LocalPlayer.PlayerGui;

	const root = ReactRoblox.createRoot(container);
	const props: RouterProps = {
		clientState: CreateClientProducer(defaultClientState),
		serverProfile: CreateProfileProducer(defaultProfileState),
		serverState: CreateServerProducer(defaultServerState),
	};

	renderRouter(root, props);

	const cleanup = setTimeout(() => {
		renderRouter(root, props);
	}, 5);

	return () => {
		root.unmount();
		container.Destroy();
		cleanup();
	};
};

export default clientInterface;
