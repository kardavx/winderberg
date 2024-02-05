import Maid from "@rbxts/maid";
import clientSignals from "shared/signal/clientSignals";
import { getServerProfile } from "./clientPlayerData";
import { Workspace } from "@rbxts/services";

const getClosestTo = (character: Character, basePartList: BasePart[]): BasePart => {
	let closest: { distance: number; basePart: BasePart } | undefined = undefined;
	basePartList.forEach((basePart) => {
		const distance = character.PrimaryPart.Position.sub(basePart.Position).Magnitude;
		if (!closest || distance < closest.distance) {
			closest = { distance, basePart };
		}
	});
	return (closest as unknown as { distance: number; basePart: BasePart }).basePart;
};

const getColliding = (character: Character, basePartList: BasePart[]): BasePart | undefined => {
	const overlapParams = new OverlapParams();
	overlapParams.FilterDescendantsInstances = basePartList;
	overlapParams.FilterType = Enum.RaycastFilterType.Include;

	const overlapResult = Workspace.GetPartsInPart(character.PrimaryPart, overlapParams);
	if (overlapResult.size() > 1) {
		return getClosestTo(character, overlapResult);
	} else if (overlapResult.size() === 1) {
		return overlapResult[0];
	} else {
		return getClosestTo(character, basePartList);
	}
};

const formatLocation = (district: string, street: string, postal: string) => `${district} ${street} St. ${postal}`;

const location: CharacterInitializerFunction = (character: Character) => {
	const maid = new Maid();

	let district = "";
	let street = "";
	let postal = "";

	maid.GiveTask(() => {
		district = "";
		street = "";
		postal = "";
	});

	maid.GiveTask(
		clientSignals.onRender.Connect((deltaTime: number) => {
			const playerProfile = getServerProfile();
			if (!playerProfile) return;

			const currentDistrict = getColliding(character, Workspace.ignore.Districts.GetChildren() as BasePart[]);
			const currentStreet = getColliding(character, Workspace.ignore.Streets.GetChildren() as BasePart[]);
			const nearestPostal = getClosestTo(character, Workspace.ignore.Postals.GetChildren() as BasePart[]);

			if (currentDistrict) district = currentDistrict.Name;
			if (currentStreet) street = currentStreet.Name;
			postal = nearestPostal.Name;

			const formattedLocation = formatLocation(district, street, postal);
			if (playerProfile.getState().location !== formattedLocation) {
				playerProfile.setLocation(formattedLocation);
			}
		}),
	);

	return () => maid.DoCleaning();
};

export default location;
