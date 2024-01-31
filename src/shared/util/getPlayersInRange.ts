import { Players } from "@rbxts/services";

type PlayersInRange = { player: Player; distance: number }[];

export default (origin: Vector3, range: number): PlayersInRange => {
	const playersInRange: PlayersInRange = [];

	Players.GetPlayers().forEach((player: Player) => {
		if (!player.Character) return;

		const position = player.Character.GetPivot().Position;
		const distance = origin.sub(position).Magnitude;
		if (distance > range) return;

		playersInRange.push({ player, distance });
	});

	return playersInRange;
};
