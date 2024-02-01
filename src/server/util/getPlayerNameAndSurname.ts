import { getPlayerProfile } from "server/controller/serverData";

export default (player: Player): string => {
	const playerProfile = getPlayerProfile(player);
	if (!playerProfile) return `Bezimienny`;

	const producerState = playerProfile.producer.getState();
	if (producerState.name === undefined || producerState.surname === undefined) return `Bezimienny`;

	return `${producerState.name} ${producerState.surname}`;
};
