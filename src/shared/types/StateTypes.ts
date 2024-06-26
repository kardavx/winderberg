import { Document } from "@rbxts/lapis";
import { ProfileProducer, State as profileState } from "shared/reflex/serverProfile";
import { ServerProducer, State as serverState } from "shared/reflex/serverState";

export interface ServerPlayerProfile {
	player: Player;
	document: Document<profileState>;
	subscription: () => void;
	producer: ProfileProducer;
	nextActionIsReplicated: boolean;
}

export interface ServerState {
	producer: ServerProducer;
	document: Document<serverState>;
	subscription: () => void;
	changedBy?: Player;
}
