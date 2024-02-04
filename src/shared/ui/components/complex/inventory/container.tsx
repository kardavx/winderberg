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
					Size={new UDim2(1, 0, 0, getViewportScaledNumber(90))}
					BackgroundTransparency={index % 2 > 0 ? 0.8 : 1}
					BorderSizePixel={0}
					BackgroundColor3={palette.Overlay1}
				>
					<Center FillDirection={Enum.FillDirection.Horizontal} />
					<Padding Size={10} />
					<frame Size={UDim2.fromScale(0.7, 1)} BackgroundTransparency={1}>
						<uilistlayout
							Padding={new UDim(0.05, 0)}
							FillDirection={Enum.FillDirection.Vertical}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							HorizontalAlignment={Enum.HorizontalAlignment.Left}
						/>

						<Text
							Size={UDim2.fromScale(1, 0.4)}
							Text={item.name}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextYAlignment={Enum.TextYAlignment.Bottom}
							TextColor3={palette.Text}
							Weight="Bold"
						/>
						<frame Size={UDim2.fromScale(1, 0.4)} BackgroundTransparency={1}>
							<uilistlayout
								Padding={new UDim(0.02, 0)}
								FillDirection={Enum.FillDirection.Horizontal}
								VerticalAlignment={Enum.VerticalAlignment.Center}
								HorizontalAlignment={Enum.HorizontalAlignment.Left}
							/>

							<Text
								Size={UDim2.fromScale(0.2, 1)}
								Text={string.upper(`Typ: ${item.type}`)}
								TextColor3={palette.Text}
								BackgroundTransparency={0}
								BackgroundColor3={palette.Base}
							>
								<uicorner CornerRadius={new UDim(0.1, 0)} />
								<Padding Size={6} />
							</Text>

							<Text
								Size={UDim2.fromScale(0.2, 1)}
								Text={string.upper(`Waga: ${item.state.weight}kg`)}
								TextColor3={palette.Text}
								BackgroundTransparency={0}
								BackgroundColor3={palette.Base}
							>
								<uicorner CornerRadius={new UDim(0.1, 0)} />
								<Padding Size={6} />
							</Text>
						</frame>
					</frame>
					<frame Size={UDim2.fromScale(0.3, 1)} BackgroundTransparency={1}>
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
		<frame
			Size={UDim2.fromScale(0.4875, 1)}
			BackgroundColor3={palette.Base}
			BorderSizePixel={0}
			BackgroundTransparency={0.25}
		>
			<Center Padding={new UDim(0.025, 0)} />
			<Padding Size={15} />
			<frame Size={UDim2.fromScale(1, 0.05 - 0.025 / 2)} BackgroundTransparency={1}>
				<Center FillDirection={Enum.FillDirection.Horizontal} />
				<Text
					Size={UDim2.fromScale(0.8, 1)}
					Weight="Bold"
					TextXAlignment={Enum.TextXAlignment.Left}
					Text={props.isExternal ? (container ? container.name : "External") : "Inventory"}
					TextColor3={palette.Text}
				/>
				<Text
					Size={UDim2.fromScale(0.2, 1)}
					TextXAlignment={Enum.TextXAlignment.Right}
					Text={weight}
					TextColor3={palette.Text}
				/>
			</frame>
			<scrollingframe
				Size={UDim2.fromScale(1, 0.95 - 0.025 / 2)}
				ScrollBarThickness={0}
				CanvasSize={UDim2.fromScale(0, 0)}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				BackgroundTransparency={1}
			>
				<uilistlayout />
				{...renderedItems}
			</scrollingframe>
		</frame>
	);
};
