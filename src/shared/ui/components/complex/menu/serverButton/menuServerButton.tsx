import Roact from "@rbxts/roact";
import Padding from "../../../base/Padding";
import Text from "../../../base/Text";
import { Mocha } from "@rbxts/catppuccin";
import useSpring from "shared/ui/hook/useSpring";
import StatusIcon from "./statusIcon";

interface Props {
	isActive: boolean;
	serverName: string;
	Callback: () => void;
}

export default (props: Props) => {
	const [hoverFactor, setHoverFactor] = useSpring({ initialValue: 0, stiffness: 80, dampening: 20 });

	return (
		<imagebutton
			Size={hoverFactor.map((factor: number) => {
				return UDim2.fromScale(0.2, 1).Lerp(UDim2.fromScale(0.225, 1.025), factor);
			})}
			Image={"rbxassetid://6856822317"}
			ScaleType={Enum.ScaleType.Crop}
			BorderSizePixel={0}
			BackgroundTransparency={1}
			Event={{
				MouseEnter: () => {
					setHoverFactor(1);
				},

				MouseLeave: () => {
					setHoverFactor(0);
				},
				MouseButton1Click: () => {
					props.Callback();
				},
			}}
		>
			<frame
				BackgroundColor3={Mocha.Crust}
				AnchorPoint={new Vector2(0.5, 1)}
				Position={UDim2.fromScale(0.5, 1)}
				BorderSizePixel={0}
				BackgroundTransparency={0.1}
				Size={UDim2.fromScale(1, 0.2)}
			>
				<Padding Size={25} />
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
				/>

				{/* left */}
				<frame Size={UDim2.fromScale(0.5, 1)} BackgroundTransparency={1}>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
					/>

					<Text Text={props.serverName} Size={UDim2.fromScale(1, 0.4)} TextColor3={Mocha.Text} />
				</frame>

				{/* right */}
				<frame Size={UDim2.fromScale(0.5, 1)} BackgroundTransparency={1}>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						HorizontalAlignment={Enum.HorizontalAlignment.Right}
					/>

					<StatusIcon isActive={props.isActive} />
				</frame>
			</frame>
		</imagebutton>
	);
};
