import Maid from "@rbxts/maid";
import { lerp } from "@rbxts/pretty-react-hooks";
import { maxFallHeight, safeFallHeight } from "shared/data/fallDamageData";
import network from "shared/network/network";
import clampedInverseLerp from "shared/util/clampedInverseLerp";

const fallDamageApi: InitializerFunction = () => {
	const maid = new Maid();

	maid.GiveTask(
		network.OnPlayerFell.connect((player: Player, distance: number) => {
			if (!player.Character) return;

			(player.Character as Character).Humanoid.Health =
				(player.Character as Character).Humanoid.Health -
				lerp(
					0,
					(player.Character as Character).Humanoid.MaxHealth,
					clampedInverseLerp(safeFallHeight, maxFallHeight, distance),
				);
		}),
	);

	return () => maid.DoCleaning();
};

export default fallDamageApi;
