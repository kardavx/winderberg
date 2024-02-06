import Remo, { Client, Server, remote, throttleMiddleware } from "@rbxts/remo";
import { t } from "@rbxts/t";
import { $terrify } from "rbxts-transformer-t-new";
import { icons } from "shared/data/notificationData";
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

	PushNotification: remote<Client, [{ title: string; description: string; icon: keyof typeof icons }]>(
		$terrify<{ title: string; description: string; icon: keyof typeof icons }>(),
	),

	Withdraw: remote<Server, [number]>(t.number),
	Deposit: remote<Server, [number]>(t.number),
	Transfer: remote<Server, [string, number]>(t.string, t.number),

	SendChatMessage: remote<Server, [string]>(t.string).middleware(throttleMiddleware(0.1)),
	ReceiveChatMessage: remote<Client, [string]>(t.string),

	OnPlayerFell: remote<Server, [number]>(t.number).middleware(throttleMiddleware(1)),

	ReplicateInteraction: remote<Server, [string, BasePart | Model]>(t.string, $terrify<BasePart | Model>()),

	TransferItem: remote<Server, ["External" | "Inventory", number]>(),
});
