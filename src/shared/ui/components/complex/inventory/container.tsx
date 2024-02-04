import Roact from "@rbxts/roact";
import { CommonProps } from "shared/types/UITypes";
import Center from "../../base/Center";
import Text from "../../base/Text";
import useProducerAsState from "shared/ui/hook/useProducerAsState";
import Padding from "../../base/Padding";
import getItemsWeight from "shared/util/getItemsWeight";
import network from "shared/network/network";
import getViewportScaledNumber from "shared/ui/util/getViewportScaledNumber";
import palette from "shared/ui/palette/palette";
import { Mocha } from "@rbxts/catppuccin";

interface Props extends CommonProps {
	containerId: number;
	isExternal: boolean;
	externalContainerOpen: boolean;
}

export default (props: Props) => {
	const [container] = useProducerAsState(props.serverState, (state) => state.containers[props.containerId]);

	let weight = `0/0kg`;
	const renderedItems: Roact.Element[] = [];

	if (container) {
		weight = `${getItemsWeight(container.content)}/${container.maxWeight}kg`;
		container.content.forEach((item, index) => {
			renderedItems.push(
				<frame
					Size={new UDim2(1, 0, 0, getViewportScaledNumber(80))}
					BackgroundTransparency={index % 2 > 0 ? 0.8 : 1}
					BorderSizePixel={0}
					BackgroundColor3={palette.Overlay1}
				>
					<Center FillDirection={Enum.FillDirection.Horizontal} />
					<Padding Size={10} />
					<frame Size={UDim2.fromScale(0.5, 1)} BackgroundTransparency={1}>
						<uilistlayout
							HorizontalAlignment={Enum.HorizontalAlignment.Left}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							FillDirection={Enum.FillDirection.Horizontal}
							Padding={new UDim(0.05, 0)}
						/>
						<Padding Size={15} />

						<imagelabel
							BorderSizePixel={0}
							BackgroundColor3={Mocha.Text}
							BackgroundTransparency={0.5}
							Size={UDim2.fromScale(1, 1)}
							ScaleType={Enum.ScaleType.Crop}
						>
							<uicorner CornerRadius={new UDim(1, 0)} />
							<uiaspectratioconstraint AspectRatio={1 / 1} />
						</imagelabel>
						<Text
							Size={UDim2.fromScale(0.8, 1)}
							Text={item.name}
							CustomTextScaled={true}
							TextWrapped={true}
							Weight="Bold"
							TextSize={22}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextYAlignment={Enum.TextYAlignment.Center}
							TextColor3={palette.Text}
						/>
					</frame>
					<frame Size={UDim2.fromScale(0.5, 1)} BackgroundTransparency={1}>
						<uilistlayout
							FillDirection={Enum.FillDirection.Horizontal}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							HorizontalAlignment={Enum.HorizontalAlignment.Right}
						/>

						<Padding Size={20} />

						<imagebutton
							Size={UDim2.fromScale(1, 1)}
							Image={"rbxassetid://6680261899"}
							ImageColor3={palette.Text}
							BackgroundTransparency={1}
							Visible={props.externalContainerOpen}
							Event={{
								MouseButton1Click: () => {
									network.TransferItem.fire(props.isExternal ? "Inventory" : "External", index);
								},
							}}
						>
							<uiaspectratioconstraint AspectRatio={1 / 1} />
						</imagebutton>
					</frame>
				</frame>,
			);
		});
	}

	return (
		<scrollingframe
			Size={UDim2.fromScale(1, 1)}
			ScrollBarThickness={0}
			CanvasSize={UDim2.fromScale(0, 0)}
			AutomaticCanvasSize={Enum.AutomaticSize.Y}
			BackgroundTransparency={1}
		>
			<uilistlayout />
			{...renderedItems}
		</scrollingframe>
	);
};
