import Roact from "@rbxts/roact";
import Padding from "shared/ui/components/base/Padding";
import Text from "shared/ui/components/base/Text";
import useSpring from "shared/ui/hook/useSpring";
import palette from "shared/ui/palette/palette";

interface Props {
	isActive: boolean;
}

const messages = {
	activeMessage:
		"<b>To jest komunikat włączonego serwera</b>\n\nMożesz bez problemowo dołączyć\n do serwera i cieszyć się rozgrywką",
	inactiveMessage:
		"<b>To jest komunikat wyłączonego serwera</b>\n\nDzieje sie tak kiedy żaden administrator nie\n jest dostępny aby nadzorować rozgrywkę",
};

export default (props: Props) => {
	const [popupShownFactor, setPopupShownFactor] = useSpring({ initialValue: 1, stiffness: 100, dampening: 20 });

	const [hoveringOverStatus, setHoveringOverStatus] = Roact.useState(false);
	const [hoveringOverPopup, setHoveringOverPopup] = Roact.useState(false);

	setPopupShownFactor(hoveringOverStatus || hoveringOverPopup ? 0 : 1);

	return (
		<frame
			Size={UDim2.fromScale(0.5, 0.5)}
			BackgroundColor3={props.isActive ? palette.Green : palette.Red}
			BorderSizePixel={0}
			Event={{
				MouseEnter: () => {
					setHoveringOverStatus(true);
				},

				MouseLeave: () => {
					setHoveringOverStatus(false);
				},
			}}
		>
			<uicorner CornerRadius={new UDim(1, 0)} />
			<uiaspectratioconstraint AspectRatio={1 / 1} />

			<canvasgroup
				AnchorPoint={new Vector2(0.5, 1)}
				Visible={popupShownFactor.map((factor: number) => factor < 0.99)}
				Position={popupShownFactor.map((factor: number) => {
					return new UDim2(0.5, 0, 0, -10).Lerp(UDim2.fromScale(0.5, 0), factor);
				})}
				GroupTransparency={popupShownFactor.map((factor: number) => factor)}
				AutomaticSize={Enum.AutomaticSize.XY}
				BackgroundColor3={palette.Mantle}
				Event={{
					MouseEnter: () => {
						setHoveringOverPopup(true);
					},

					MouseLeave: () => {
						setHoveringOverPopup(false);
					},
				}}
			>
				<uilistlayout
					VerticalAlignment={Enum.VerticalAlignment.Center}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
				/>
				<uicorner CornerRadius={new UDim(0.1, 0)} />
				<Text
					TextScaled={false}
					Text={props.isActive === true ? messages.activeMessage : messages.inactiveMessage}
					TextColor3={palette.Text}
					AutomaticSize={Enum.AutomaticSize.XY}
					TextSize={30}
					ZIndex={100}
					TextXAlignment={Enum.TextXAlignment.Center}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
				>
					<Padding Size={25} />
				</Text>
			</canvasgroup>
		</frame>
	);
};
