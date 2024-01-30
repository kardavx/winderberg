import { Mocha } from "@rbxts/catppuccin";
import Maid from "@rbxts/maid";
import Roact from "@rbxts/roact";
import { CommonProps } from "shared/types/UITypes";
import Padding from "shared/ui/components/base/Padding";
import Stroke from "shared/ui/components/base/Stroke";
import Text from "shared/ui/components/base/Text";
import TextBox from "shared/ui/components/base/TextBox";
import useSpring from "shared/ui/hook/useSpring";
import getViewportScaledNumber from "shared/ui/util/getViewportScaledNumber";
import getViewportScaledUdim from "shared/ui/util/getViewportScaledUdim";
import OnKeyClicked from "shared/util/OnKeyClicked";

export default (props: CommonProps) => {
	const [shownFactor, setShownFactor] = useSpring({ initialValue: 1, stiffness: 80, dampening: 20 });
	const [messages, setMessages] = Roact.useState([] as string[]);
	const textBoxRef = Roact.useRef(undefined) as unknown as {
		current: TextBox;
	};

	const renderedMessages: Roact.Element[] = [];
	messages.forEach((message: string) => {
		renderedMessages.push(
			<Text
				TextColor3={Mocha.Text}
				Stroke={10}
				Text={message}
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
		}

		return () => maid.DoCleaning();
	});

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
			<uilistlayout VerticalAlignment={Enum.VerticalAlignment.Top} Padding={new UDim(0.02, 0)} />
			<frame
				Size={UDim2.fromScale(1, 0.79525)}
				BorderSizePixel={0}
				BackgroundTransparency={shownFactor.map((factor: number) => factor)}
				BackgroundColor3={Mocha.Base}
			>
				<uicorner CornerRadius={getViewportScaledUdim(10)} />
				<Stroke
					Thickness={getViewportScaledNumber(1.5)}
					Transparency={shownFactor.map((factor: number) => factor)}
					Color={Mocha.Text}
				/>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Bottom}
				/>

				{renderedMessages}
			</frame>
			<canvasgroup
				Size={UDim2.fromScale(1, 0.19525)}
				BorderSizePixel={0}
				Visible={shownFactor.map((factor: number) => factor < 0.99)}
				AutomaticSize={Enum.AutomaticSize.Y}
				GroupTransparency={shownFactor.map((factor: number) => factor)}
				BackgroundTransparency={0}
				BackgroundColor3={Mocha.Base}
			>
				<uicorner CornerRadius={getViewportScaledUdim(10)} />
				<Stroke
					Thickness={getViewportScaledNumber(1.5)}
					Transparency={shownFactor.map((factor: number) => factor)}
					Color={Mocha.Text}
				/>
				<TextBox
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					CustomTextScaled={true}
					Text=""
					Active={false}
					ShowNativeInput={false}
					TextWrapped={true}
					TextColor3={Mocha.Text}
					forwardedRef={textBoxRef}
					AutomaticSize={Enum.AutomaticSize.Y}
					TextSize={18}
					ClearTextOnFocus={false}
					TextXAlignment={Enum.TextXAlignment.Left}
					FocusChanged={(focused: boolean, enterPressed: boolean) => {
						if (focused) {
							setShownFactor(0);
						} else {
							setShownFactor(1);
							if (enterPressed) {
								const message = textBoxRef.current.Text;

								textBoxRef.current.ReleaseFocus();
								textBoxRef.current.Text = "";

								if (message !== "") {
									setMessages([...messages, message]);
								}
							}
						}
					}}
				>
					<Padding Size={15} />
				</TextBox>
			</canvasgroup>
		</frame>
	);
};
