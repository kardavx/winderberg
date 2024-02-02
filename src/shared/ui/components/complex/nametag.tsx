import Roact from "@rbxts/roact";
import useSpring from "shared/ui/hook/useSpring";
import FullscreenFrame from "../base/FullscreenFrame";
import Text from "../base/Text";
import Maid from "@rbxts/maid";

interface Props {
	playerCharacter: Character;
}

export default (props: Props) => {
	const [characterName, setCharacterName] = Roact.useBinding(
		tostring(props.playerCharacter.GetAttribute("characterName")),
	);
	const [characterDuty, setCharacterDuty] = Roact.useState(
		tostring(props.playerCharacter.GetAttribute("characterDuty")),
	);

	Roact.useEffect(() => {
		const maid = new Maid();
		maid.GiveTask(
			props.playerCharacter.AttributeChanged.Connect((attributeName) => {
				if (attributeName === "characterDuty") {
					setCharacterDuty(props.playerCharacter.GetAttribute(attributeName) as string);
				} else if (attributeName === "characterName") {
					setCharacterName(props.playerCharacter.GetAttribute(attributeName) as string);
				}
			}),
		);

		return () => {
			maid.DoCleaning();
		};
	});

	return (
		<>
			<uilistlayout
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
				SortOrder={Enum.SortOrder.LayoutOrder}
			></uilistlayout>
			<textlabel // player name and id
				Text={characterName || ""}
				RichText={true}
				TextScaled={true}
				FontFace={Font.fromEnum(Enum.Font.Ubuntu)}
				TextColor3={Color3.fromRGB(247, 247, 247)}
				LayoutOrder={2}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 0.35)}
			></textlabel>
			<textlabel // duty
				Text={characterDuty || ""}
				RichText={true}
				TextScaled={true}
				FontFace={Font.fromEnum(Enum.Font.Ubuntu)}
				TextColor3={Color3.fromRGB(0, 0, 200)}
				LayoutOrder={1}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 0.25)}
			></textlabel>
			<frame // duty
				Size={UDim2.fromScale(1, 0.4)}
				LayoutOrder={0}
				BackgroundTransparency={1}
			></frame>
		</>
	);
};
