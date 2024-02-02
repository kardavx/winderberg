import Maid from "@rbxts/maid";
import ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import nametag from "shared/ui/components/complex/nametag";

const maid = new Maid();

type NameTagCreatedFor = {
	[playerName: string]: ReactRoblox.Root;
};

const nameTagCreatedFor: NameTagCreatedFor = {};

export default () => {
	const localPlayer = Players.LocalPlayer as LocalPlayer;
	const nametagsContainer = new Instance("ScreenGui");
	nametagsContainer.Name = "nametagsContainer";
	nametagsContainer.Parent = localPlayer.PlayerGui;

	const addNametag = (character: Character) => {
		const bgui = new Instance("BillboardGui");
		bgui.ClipsDescendants = false;
		bgui.Size = UDim2.fromScale(6, 1.875);
		bgui.StudsOffset = new Vector3(0, 1.8, 0);
		bgui.Parent = nametagsContainer;
		bgui.Adornee = character.WaitForChild("Head") as BasePart;
		const createRoot = ReactRoblox.createRoot(bgui);
		createRoot.render(Roact.createElement(nametag, { playerCharacter: character }));
		nameTagCreatedFor[character.Name] = createRoot;
	};

	const removeNametag = (character: Character) => {
		nameTagCreatedFor[character.Name].unmount();
	};

	maid.GiveTask(
		Players.PlayerAdded.Connect((player) => {
			maid.GiveTask(player.CharacterAdded.Connect((character) => addNametag(character as Character)));
			maid.GiveTask(player.CharacterRemoving.Connect((character) => removeNametag(character as Character)));
		}),
	);

	Players.GetPlayers().forEach((player) => {
		if (player.Character) {
			addNametag(player.Character as Character);
		}
	});

	return () => {
		maid.DoCleaning();
		for (const [_, renderedUI] of pairs(nameTagCreatedFor)) {
			renderedUI.unmount();
		}
		nametagsContainer.Destroy();
	};
};
