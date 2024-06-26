import Maid from "@rbxts/maid";
import Roact from "@rbxts/roact";
import commands from "shared/data/commands";
import network from "shared/network/network";
import { CommonProps } from "shared/types/UITypes";
import Padding from "shared/ui/components/base/Padding";
import Stroke from "shared/ui/components/base/Stroke";
import Text from "shared/ui/components/base/Text";
import TextBox from "shared/ui/components/base/TextBox";
import useSpring from "shared/ui/hook/useSpring";
import palette from "shared/ui/palette/palette";
import getViewportScaledNumber from "shared/ui/util/getViewportScaledNumber";
import getViewportScaledUdim from "shared/ui/util/getViewportScaledUdim";
import OnKeyClicked from "shared/util/OnKeyClicked";
import OnUISKeyClicked from "shared/util/OnUISKeyClicked";
import hasPrefix from "shared/util/hasPrefix";

const findFirstCommand = (command: string): string => {
	const matched: string[] = [];
	let shortest: string = "";

	for (const [commandName, _] of pairs(commands)) {
		const [firstMatchedCommand] = string.find((commandName as string).lower(), command.lower(), 1, true);
		if (firstMatchedCommand !== undefined) {
			matched.push(commandName as string);
		}
	}

	matched.forEach((match: string) => {
		if (shortest === "" || shortest.size() > match.size()) {
			shortest = match;
		}
	});

	if (shortest !== "") {
		let paramsString = "";
		const commandParams = commands[shortest as CommandsUnion];
		commandParams.forEach((param: string) => {
			paramsString = `${paramsString} (${param})`;
		});

		return `/${shortest} ${paramsString}`;
	}

	return "";
};

export default (props: CommonProps) => {
	const [shownFactor, setShownFactor] = useSpring({ initialValue: 1, stiffness: 80, dampening: 20 });
	const [messages, setMessages] = Roact.useState([] as string[]);
	const [message, setMessage] = Roact.useState("");
	const [messageHistory, setMessageHistory] = Roact.useState([] as string[]);
	const [historyIndex, setHistoryIndex] = Roact.useState(undefined as number | undefined);
	const textBoxRef = Roact.useRef(undefined) as unknown as {
		current: TextBox;
	};

	let suggestedCommand = "";
	if (hasPrefix(message) && message.size() > 1 && message.split(" ").size() === 1) {
		const messageWithoutPrefix = message.sub(2);
		suggestedCommand = findFirstCommand(messageWithoutPrefix);
	} else {
		suggestedCommand = "";
	}

	const renderedMessages: Roact.Element[] = [];
	messages.forEach((message: string, index: number) => {
		renderedMessages.push(
			<Text
				TextColor3={palette.Text}
				Stroke={10}
				Text={message}
				Weight="Bold"
				LayoutOrder={index}
				TextStrokeTransparency={0}
				TextStrokeColor3={palette.Base}
				Size={UDim2.fromScale(1, 0)}
				CustomTextScaled={true}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextSize={18}
				TextWrapped={true}
				AutomaticSize={Enum.AutomaticSize.Y}
			/>,
		);
	});

	Roact.useEffect(() => {
		const maid = new Maid();

		if (textBoxRef.current) {
			maid.GiveTask(
				OnKeyClicked(
					"TypeInChat",
					() => {
						if (!textBoxRef.current.IsFocused()) {
							textBoxRef.current.CaptureFocus();
							task.wait();
							textBoxRef.current.Text = textBoxRef.current.Text.sub(
								1,
								textBoxRef.current.Text.size() - 1,
							);
						}
					},
					Enum.KeyCode.Slash,
				),
			);

			maid.GiveTask(
				OnUISKeyClicked(() => {
					if (!textBoxRef.current.IsFocused() || messageHistory.size() === 0) return;

					if (historyIndex === undefined) {
						setHistoryIndex(0);
						textBoxRef.current.Text = messageHistory[0];
						return;
					}

					const newHistoryIndex = math.min(historyIndex + 1, messageHistory.size() - 1);
					setHistoryIndex(newHistoryIndex);
					textBoxRef.current.Text = messageHistory[newHistoryIndex];
				}, Enum.KeyCode.Up),
			);

			maid.GiveTask(
				OnUISKeyClicked(() => {
					if (!textBoxRef.current.IsFocused() || historyIndex === undefined || messageHistory.size() === 0)
						return;

					const newHistoryIndex = math.max(historyIndex - 1, 0);
					setHistoryIndex(newHistoryIndex);
					textBoxRef.current.Text = messageHistory[newHistoryIndex];
				}, Enum.KeyCode.Down),
			);

			if (textBoxRef.current.IsFocused()) {
				props.serverProfile.startTyping();
			}
		}

		maid.GiveTask(
			network.ReceiveChatMessage.connect((message: string) => {
				const newMessages = [...messages, message];
				if (newMessages.size() === 15) newMessages.remove(0);

				setMessages(newMessages);
			}),
		);

		return () => maid.DoCleaning();
	});

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
			<uilistlayout VerticalAlignment={Enum.VerticalAlignment.Top} Padding={new UDim(0.02, 0)} />
			<frame
				Size={UDim2.fromScale(1, 0.79525)}
				BorderSizePixel={0}
				BackgroundTransparency={shownFactor.map((factor: number) => factor)}
				BackgroundColor3={palette.Base}
			>
				<uicorner CornerRadius={getViewportScaledUdim(10)} />
				<Stroke
					Thickness={getViewportScaledNumber(1.5)}
					Transparency={shownFactor.map((factor: number) => factor)}
					Color={palette.Text}
				/>
				<Padding Size={15} />
				<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1} ClipsDescendants={true}>
					<uilistlayout
						Padding={getViewportScaledUdim(5)}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Bottom}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>

					{renderedMessages}
				</frame>
			</frame>
			<canvasgroup
				Size={UDim2.fromScale(1, 0.19525)}
				BorderSizePixel={0}
				Visible={shownFactor.map((factor: number) => factor < 0.99)}
				AutomaticSize={Enum.AutomaticSize.Y}
				GroupTransparency={shownFactor.map((factor: number) => factor)}
				BackgroundTransparency={0}
				BackgroundColor3={palette.Base}
			>
				<uicorner CornerRadius={getViewportScaledUdim(10)} />
				<Stroke
					Thickness={getViewportScaledNumber(1.5)}
					Transparency={shownFactor.map((factor: number) => factor)}
					Color={palette.Text}
				/>
				<Text
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					CustomTextScaled={true}
					Text={suggestedCommand}
					Weight="Bold"
					TextWrapped={true}
					TextColor3={palette.Text}
					TextTransparency={0.5}
					AutomaticSize={Enum.AutomaticSize.Y}
					TextSize={18}
					TextXAlignment={Enum.TextXAlignment.Left}
				>
					<Padding Size={15} />
				</Text>
				<TextBox
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					CustomTextScaled={true}
					Text=""
					Active={false}
					Weight="Bold"
					ZIndex={2}
					ShowNativeInput={false}
					TextStrokeTransparency={0}
					TextStrokeColor3={palette.Base}
					TextWrapped={true}
					TextColor3={palette.Text}
					forwardedRef={textBoxRef}
					AutomaticSize={Enum.AutomaticSize.Y}
					TextSize={18}
					ClearTextOnFocus={false}
					TextXAlignment={Enum.TextXAlignment.Left}
					FocusChanged={(focused: boolean, enterPressed: boolean) => {
						if (focused) {
							setShownFactor(0);
							props.serverProfile.startTyping();
						} else {
							setShownFactor(1);
							props.serverProfile.endTyping();
							if (enterPressed) {
								const message = textBoxRef.current.Text;

								textBoxRef.current.ReleaseFocus();
								setHistoryIndex(undefined);
								textBoxRef.current.Text = "";

								if (message !== "") {
									if (message.lower() === "/clear") {
										setMessages([]);
										return;
									}

									const newHistory = [...messageHistory];
									newHistory.insert(0, message);
									if (newHistory.size() > 10) newHistory.pop();

									setMessageHistory(newHistory);
									network.SendChatMessage.fire(message);
								}
							}
						}
					}}
					TextChanged={(message: string) => setMessage(message)}
				>
					<Padding Size={15} />
				</TextBox>
			</canvasgroup>
		</frame>
	);
};
