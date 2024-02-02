import Roact from "@rbxts/roact";
import Padding from "../../../base/Padding";
import Text from "../../../base/Text";
import getViewportScaledUdim from "shared/ui/util/getViewportScaledUdim";
import { icons } from "shared/data/notificationData";
import palette from "shared/ui/palette/palette";

interface Props {
	title: string;
	description: string;
	icon: keyof typeof icons;
	callback: () => void;
}

export default (props: Props) => {
	return (
		<textbutton
			Size={UDim2.fromScale(1, 1)}
			AutomaticSize={Enum.AutomaticSize.Y}
			BackgroundColor3={palette.Base}
			AutoButtonColor={false}
			Text=""
			BorderSizePixel={0}
			Event={{
				MouseButton1Click: () => {
					props.callback();
				},
			}}
		>
			<uicorner CornerRadius={getViewportScaledUdim(25)} />
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
				Padding={new UDim(0.05, 0)}
			/>
			<Padding Size={25} />

			<frame Size={UDim2.fromScale(0.2, 1)} BackgroundTransparency={1}>
				<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} />

				<frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={palette.Blue} BorderSizePixel={0}>
					<uicorner CornerRadius={new UDim(0.25, 0)} />
					<uiaspectratioconstraint AspectRatio={1 / 1} />
					<uigradient
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, new Color3(0.7, 0.7, 0.7)),
								new ColorSequenceKeypoint(1, new Color3(1, 1, 1)),
							])
						}
						Rotation={-90}
					/>
					<Padding Size={10} />

					<imagelabel Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1} Image={icons[props.icon]}>
						<uiaspectratioconstraint AspectRatio={1 / 1} />
					</imagelabel>
				</frame>
			</frame>
			<frame Size={UDim2.fromScale(0.65, 1)} AutomaticSize={Enum.AutomaticSize.Y} BackgroundTransparency={1}>
				<uilistlayout VerticalAlignment={Enum.VerticalAlignment.Center} />
				<Text
					Size={UDim2.fromScale(1, 0)}
					TextColor3={palette.Text}
					TextSize={20}
					AutomaticSize={Enum.AutomaticSize.Y}
					CustomTextScaled={true}
					TextYAlignment={Enum.TextYAlignment.Center}
					TextXAlignment={Enum.TextXAlignment.Left}
					Text={string.upper(props.title)}
					Weight="Bold"
				/>
				<Text
					Size={UDim2.fromScale(1, 0)}
					TextColor3={palette.Text}
					CustomTextScaled={true}
					AutomaticSize={Enum.AutomaticSize.Y}
					TextWrapped={true}
					TextYAlignment={Enum.TextYAlignment.Center}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextSize={18}
					Text={props.description}
				/>
			</frame>
		</textbutton>
	);
};
