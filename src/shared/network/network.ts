import Remo, { Client, Server, remote, throttleMiddleware } from "@rbxts/remo";
import { t } from "@rbxts/t";
import { State as profileState } from "shared/reflex/serverProfile";
import { State as serverState } from "shared/reflex/serverState";

export default Remo.createRemotes({
	GetPlayerData: remote<Server, []>().returns<profileState | undefined>(),
	GetServerData: remote<Server, []>().returns<serverState | undefined>(),
	ReplicateProfile: remote<Server, [{ name: string; arguments: [...args: unknown[]] }]>(
		t.interface({ name: t.string, arguments: t.array(t.any) }),
	),
	ReplicateState: remote<Server, [{ name: string; arguments: [...args: unknown[]] }]>(
		t.interface({ name: t.string, arguments: t.array(t.any) }),
	),
	GetReplicatedProfile: remote<Client, [{ name: string; arguments: [...args: unknown[]] }]>(
		t.interface({ name: t.string, arguments: t.array(t.any) }),
	),
	GetReplicatedState: remote<Client, [{ name: string; arguments: [...args: unknown[]] }]>(
		t.interface({ name: t.string, arguments: t.array(t.any) }),
	),

	SendChatMessage: remote<Server, [string]>(t.string).middleware(throttleMiddleware(0.1)),
	ReceiveChatMessage: remote<Client, [string]>(t.string),

	OpenTrunk: remote<Server, []>(),
	TransferItem: remote<Server, ["External" | "Inventory", number]>(),
});
