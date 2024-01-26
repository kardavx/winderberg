import ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { setTimeout } from "@rbxts/set-timeout";
import GameRouter from "shared/ui/gameRouter";
import LocalPlayer from "shared/util/LocalPlayer";

const renderRouter = (root: ReactRoblox.Root, props: CommonProps) => {
	root.render(Roact.createElement(GameRouter, props));
};

const clientInterface: InitializerFunction = () => {
	const container = new Instance("ScreenGui");
	container.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
	container.Name = "Client";
	container.Parent = LocalPlayer.PlayerGui;

	const root = ReactRoblox.createRoot(container);
	const props = {
		clientState: {
			loading: true,
		},
	};

	renderRouter(root, props);

	const cleanup = setTimeout(() => {
		props.clientState.loading = false;
		renderRouter(root, props);
	}, 5);

	return () => {
		root.unmount();
		container.Destroy();
		cleanup();
	};
};

export default clientInterface;
