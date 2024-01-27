import ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { RouterProps } from "shared/types/UITypes";
import GameRouter from "shared/ui/gameRouter";
import LocalPlayer from "shared/util/LocalPlayer";
import { clientProducer, isPlayerDataLoaded, isServerDataLoaded, serverProfile, serverState } from "./clientPlayerData";
import clientSignals from "shared/signal/clientSignals";

const renderRouter = (root: ReactRoblox.Root, props: RouterProps) => {
	root.render(Roact.createElement(GameRouter, props));
};

const clientInterface: InitializerFunction = () => {
	const container = new Instance("ScreenGui");
	container.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
	container.Name = "Client";
	container.Parent = LocalPlayer.PlayerGui;

	const root = ReactRoblox.createRoot(container);

	renderRouter(root, {
		clientState: clientProducer,
		serverProfile: serverProfile,
		serverState: serverState,
	});

	if (!isPlayerDataLoaded) {
		clientSignals.playerDataLoaded.Once(() => {
			renderRouter(root, {
				clientState: clientProducer,
				serverProfile: serverProfile,
				serverState: serverState,
			});
		});
	}

	if (!isServerDataLoaded) {
		clientSignals.serverDataLoaded.Once(() => {
			renderRouter(root, {
				clientState: clientProducer,
				serverProfile: serverProfile,
				serverState: serverState,
			});
		});
	}

	return () => {
		root.unmount();
		container.Destroy();
	};
};

export default clientInterface;
