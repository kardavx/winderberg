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

export default (props: CommonProps) => {
	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
			<frame Size={UDim2.fromScale(0.2, 1)} BackgroundTransparency={1}>
				<uilistlayout
					Padding={new UDim(0.02, 0)}
					VerticalAlignment={Enum.VerticalAlignment.Bottom}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
				/>
				<Padding Size={20} />

				<frame Size={UDim2.fromScale(1, 0.1)} BackgroundTransparency={1}>
					<Notifications {...props} />
				</frame>

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
							TextColor3={new Color3(1, 1, 1)}
							Text={"100$"}
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
							Text={"Nathan Presscot"}
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
