import Maid from "@rbxts/maid";
import ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { setTimeout } from "@rbxts/set-timeout";
import { CreateProducer as CreateClientProducer, defaultState as defaultClientState } from "shared/reflex/clientState";
import {
	CreateProducer as CreateProfileProducer,
	defaultState as defaultProfileState,
} from "shared/reflex/serverProfile";
import { CreateProducer as CreateServerProducer, defaultState as defaultServerState } from "shared/reflex/serverState";
import gameRouter from "shared/ui/gameRouter";

const mockFunction = (name: string) => {
	return (...args: unknown[]) => warn(`called ${name} with args`, ...args);
};

const debugLoadingTime = 0.5;

export = (target: ScreenGui): (() => void) => {
	const maid = new Maid();
	const root = ReactRoblox.createRoot(target);
	let killed = false;

	try {
		const clientStateProducer = CreateClientProducer(defaultClientState);
		const serverProfileProducer = CreateProfileProducer(defaultProfileState);
		const serverStateProducer = CreateServerProducer(defaultServerState);

		print("loading started");

		root.render(
			Roact.createElement(gameRouter, {
				clientState: clientStateProducer,
			}),
		);

		setTimeout(() => {
			if (killed) return;

			print("loading ended");

			root.render(
				Roact.createElement(gameRouter, {
					clientState: clientStateProducer,
					serverProfile: serverProfileProducer,
					serverState: serverStateProducer,
				}),
			);
		}, debugLoadingTime);

		maid.GiveTask(() => root.unmount());
	} catch (err) {
		warn("Error while running GameRouter");
		warn(err);
	}

	return () => {
		killed = true;
		maid.DoCleaning();
	};
};
