import Maid from "@rbxts/maid";
import { Players } from "@rbxts/services";
import { getPlayerProfile } from "server/controller/serverData";
import getPlayerNameAndSurname from "server/util/getPlayerNameAndSurname";
import serverSignals from "shared/signal/serverSignals";

const maid = new Maid();

export default () => {
	maid.GiveTask(
		serverSignals.characterAdded.Connect((player) => {
			const character = player.Character as Character;
			const playerProfile = getPlayerProfile(player);
			character.SetAttribute("characterName", getPlayerNameAndSurname(player));
			character.SetAttribute("characterDuty", "");
			warn("TEMP INFO INIT");
		}),
	);

	return () => {
		maid.DoCleaning();
	};
};
