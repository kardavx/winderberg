import Roact from "@rbxts/roact";
import { CommonProps } from "shared/types/UITypes";
import Padding from "../../base/Padding";
import Center from "../../base/Center";
import Text from "../../base/Text";
import Notifications from "./notifications/notifications";
import Health from "./bars/health";
import Stamina from "./bars/stamina";
import Hunger from "./bars/hunger";
import Thirst from "./bars/thirst";
import Chat from "./chat/chat";
import useProducerAsState from "shared/ui/hook/useProducerAsState";

export default (props: CommonProps) => {
	const [money] = useProducerAsState(props.serverProfile, (state) => state.money);
	const [name] = useProducerAsState(props.serverProfile, (state) => state.name);
	const [surname] = useProducerAsState(props.serverProfile, (state) => state.surname);

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
			<frame Size={UDim2.fromScale(0.2, 1)} BackgroundTransparency={1}>
				<uilistlayout
					Padding={new UDim(0.02, 0)}
					VerticalAlignment={Enum.VerticalAlignment.Bottom}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
				/>
				<Padding Size={20} />

				<frame Size={UDim2.fromScale(1.5, 0.3)} BackgroundTransparency={1}>
					<Chat {...props} />
				</frame>

				<canvasgroup Size={UDim2.fromScale(1, 0.55)} BackgroundTransparency={1}>
					<uigradient
						Transparency={
							new NumberSequence([
								new NumberSequenceKeypoint(0, 1),
								new NumberSequenceKeypoint(0.1, 0),
								new NumberSequenceKeypoint(1, 0),
							])
						}
						Rotation={90}
					/>
					<frame
						Size={UDim2.fromScale(1, 0.2)}
						AnchorPoint={new Vector2(0, 1)}
						Position={UDim2.fromScale(0, 1)}
						BackgroundTransparency={1}
					>
						<Notifications {...props} />
					</frame>
				</canvasgroup>

				<frame Size={UDim2.fromScale(1, 0.05)} BackgroundTransparency={1}>
					<Center />
					<frame Size={UDim2.fromScale(1, 0.5)} BackgroundTransparency={1}>
						<uilistlayout
							Padding={new UDim(0.02, 0)}
							FillDirection={Enum.FillDirection.Horizontal}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							HorizontalAlignment={Enum.HorizontalAlignment.Left}
						/>

						<imagelabel
							Size={UDim2.fromScale(1, 1)}
							ScaleType={Enum.ScaleType.Crop}
							Image={"rbxassetid://6908632622"}
							BackgroundTransparency={1}
						>
							<uiaspectratioconstraint AspectRatio={1 / 1} />
						</imagelabel>

						<Text
							Size={UDim2.fromScale(0.7, 1)}
							TextXAlignment={Enum.TextXAlignment.Left}
							CustomTextScaled={true}
							AutomaticSize={Enum.AutomaticSize.X}
							TextColor3={new Color3(1, 1, 1)}
							Text={`${money}$`}
							TextSize={22}
						/>
					</frame>
					<frame Size={UDim2.fromScale(1, 0.5)} BackgroundTransparency={1}>
						<uilistlayout
							Padding={new UDim(0.02, 0)}
							FillDirection={Enum.FillDirection.Horizontal}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							HorizontalAlignment={Enum.HorizontalAlignment.Left}
						/>

						<imagelabel
							Size={UDim2.fromScale(1, 1)}
							ScaleType={Enum.ScaleType.Crop}
							Image={"rbxassetid://11955992141"}
							BackgroundTransparency={1}
						>
							<uiaspectratioconstraint AspectRatio={1 / 1} />
						</imagelabel>

						<Text
							Size={UDim2.fromScale(0.7, 1)}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextColor3={new Color3(1, 1, 1)}
							CustomTextScaled={true}
							AutomaticSize={Enum.AutomaticSize.X}
							Text={`${name} ${surname}`}
							TextSize={22}
						/>
					</frame>
				</frame>

				<frame Size={UDim2.fromScale(1, 0.04)} BackgroundTransparency={1}>
					<Center FillDirection={Enum.FillDirection.Horizontal} Padding={new UDim(0.02, 0)} />
					<Health Size={0.33} />
					<Stamina Size={0.33} {...props} />
					<Hunger Size={0.13} {...props} />
					<Thirst Size={0.13} {...props} />
				</frame>
			</frame>
		</frame>
	);
};
