import Remo, { Server, loggerMiddleware, remote, throttleMiddleware } from "@rbxts/remo";
import { t } from "@rbxts/t";

export default Remo.createRemotes({
	TestReplicate: remote<Server, [message: string]>(t.string).middleware(
		loggerMiddleware,
		throttleMiddleware({
			throttle: 1,
		}),
	),
});
