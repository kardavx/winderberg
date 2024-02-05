import Roact from "@rbxts/roact";
import useSpring from "shared/ui/hook/useSpring";
import FullscreenFrame from "../base/FullscreenFrame";
import Text from "../base/Text";
import Maid from "@rbxts/maid";

interface Props {
	playerCharacter: Character;
}

const dutyValue = (value: string) => {
	if (value === "") {
		return false;
	} else {
		return true;
	}
};

export default (props: Props) => {
	const [characterName, setCharacterName] = Roact.useBinding(
		tostring(props.playerCharacter.GetAttribute("characterName")),
	);
	const [sessionId, setSessionId] = Roact.useBinding(tostring(props.playerCharacter.GetAttribute("sessionId")));
	const [characterDuty, setCharacterDuty] = Roact.useBinding(
		tostring(props.playerCharacter.GetAttribute("characterDuty")),
	);
	const [characterTyping, setCharacterTyping] = Roact.useBinding(
		props.playerCharacter.GetAttribute("characterTyping") as boolean,
	);

	Roact.useEffect(() => {
		const maid = new Maid();
		maid.GiveTask(
			props.playerCharacter.AttributeChanged.Connect((attributeName) => {
				if (attributeName === "characterDuty") {
					setCharacterDuty(props.playerCharacter.GetAttribute(attributeName) as string);
				} else if (attributeName === "characterName") {
					setCharacterName(props.playerCharacter.GetAttribute(attributeName) as string);
				} else if (attributeName === "sessionId") {
					setSessionId(props.playerCharacter.GetAttribute(attributeName) as string);
				} else if (attributeName === "characterTyping") {
					setCharacterTyping(props.playerCharacter.GetAttribute(attributeName) as boolean);
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
			<Text // player name and id
				Text={Roact.joinBindings({ characterName, sessionId }).map(({ characterName, sessionId }) => {
					return `${characterName} <font color="rgb(127,127,127)">(${sessionId})</font>`;
				})}
				Weight="Bold"
				RichText={true}
				TextScaled={true}
				LayoutOrder={2}
				Size={UDim2.fromScale(1, 0.35)}
			/>
			<Text // duty
				Text={characterDuty.map((duty) => duty)}
				RichText={true}
				TextScaled={true}
				TextColor3={Color3.fromRGB(0, 0, 200)}
				LayoutOrder={1}
				Size={UDim2.fromScale(1, 0.25)}
				Visible={characterDuty.map((duty) => duty !== "")}
			/>
			<frame // duty
				Size={UDim2.fromScale(1, 0.4)}
				LayoutOrder={0}
				BackgroundTransparency={1}
			>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					SortOrder={Enum.SortOrder.LayoutOrder}
					FillDirection={Enum.FillDirection.Horizontal}
				></uilistlayout>
				<imagelabel
					Image={"rbxassetid://16257570995"}
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					Visible={characterTyping.map((typing) => (typing !== undefined ? typing : false))}
				>
					<uiaspectratioconstraint></uiaspectratioconstraint>
				</imagelabel>
			</frame>
		</>
	);
};
