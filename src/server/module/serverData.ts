import { Signal } from "@rbxts/beacon";
import { Producer } from "@rbxts/reflex";
import { Actions as serverActions, State as serverProdState } from "shared/reflex/serverState";
import { ServerPlayerProfile } from "shared/types/ProfileTypes";

export let serverState: Producer<serverProdState, serverActions> | undefined;
const playerDataLoadedEvent: Signal<[Player, ServerPlayerProfile]> = new Signal();

const serverData: InitializerFunction = () => {
	const playerProfiles: { [playerName: string]: ServerPlayerProfile | undefined } = {};

	return () => {};
};

export default serverData;
