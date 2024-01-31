import Remo, { Client, Server, remote, throttleMiddleware } from "@rbxts/remo";
import { t } from "@rbxts/t";
import { State as profileState } from "shared/reflex/serverProfile";
import { State as serverState } from "shared/reflex/serverState";

export default Remo.createRemotes({
	GetPlayerData: remote<Server, []>().returns<profileState | undefined>(),
	GetServerData: remote<Server, []>().returns<serverState | undefined>(),
	ReplicateProfile: remote<Server, [{ name: string; arguments: [...args: unknown[]] }]>(),
	ReplicateState: remote<Server, [{ name: string; arguments: [...args: unknown[]] }]>(),
	GetReplicatedProfile: remote<Client, [{ name: string; arguments: [...args: unknown[]] }]>(),
	GetReplicatedState: remote<Client, [{ name: string; arguments: [...args: unknown[]] }]>(),

	SendChatMessage: remote<Server, [string]>(t.string).middleware(throttleMiddleware(0.1)),
	ReceiveChatMessage: remote<Client, [string]>(t.string),
});
