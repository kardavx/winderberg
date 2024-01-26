import { ProfileProducer } from "shared/reflex/serverProfile";

export type ServerPlayerProfile = {
	player: Player;
	producer: ProfileProducer;
	nextActionIsReplicated: boolean;
};
