import Roact from "@rbxts/roact";
import { CommonProps } from "shared/types/UITypes";
import Padding from "../../base/Padding";
import Center from "../../base/Center";
import Bar from "./bar";
import { Mocha } from "@rbxts/catppuccin";
import Text from "../../base/Text";
import Notifications from "./notifications/notifications";

export default (props: CommonProps) => {
	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
			<frame Size={UDim2.fromScale(0.25, 1)} BackgroundTransparency={1}>
				<uilistlayout
					Padding={new UDim(0.02, 0)}
					VerticalAlignment={Enum.VerticalAlignment.Bottom}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
				/>
				<Padding Size={20} />

				<frame Size={UDim2.fromScale(1, 0.1)} BackgroundTransparency={1}>
					<Notifications {...props} />
				</frame>

				<frame Size={UDim2.fromScale(1, 0.08)} BackgroundTransparency={1}>
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
							TextSize={30}
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
							TextSize={30}
						/>
					</frame>
				</frame>

				<frame Size={UDim2.fromScale(1, 0.05)} BackgroundTransparency={1}>
					<Center FillDirection={Enum.FillDirection.Horizontal} Padding={new UDim(0.02, 0)} />
					<Bar
						icon="rbxassetid://13780996931"
						iconXOffset={0.2}
						progress={100}
						Size={UDim2.fromScale(0.33, 1)}
						BackgroundColor3={Mocha.Green}
					/>
					<Bar
						icon="rbxassetid://858523021"
						iconXOffset={0.2}
						progress={100}
						Size={UDim2.fromScale(0.33, 1)}
						BackgroundColor3={Mocha.Yellow}
					/>
					<Bar
						icon="rbxassetid://6493469433"
						iconXOffset={0}
						progress={100}
						Size={UDim2.fromScale(0.13, 1)}
						BackgroundColor3={Mocha.Maroon}
					/>
					<Bar
						icon="rbxassetid://13492318033"
						iconXOffset={0}
						progress={100}
						Size={UDim2.fromScale(0.13, 1)}
						BackgroundColor3={Mocha.Blue}
					/>
				</frame>
			</frame>
		</frame>
	);
};
