import Roact from "@rbxts/roact";
import { CommonProps } from "shared/types/UITypes";
import Center from "../../base/Center";
import Text from "../../base/Text";
import useProducerAsState from "shared/ui/util/useProducerAsState";
import { Mocha } from "@rbxts/catppuccin";
import Padding from "../../base/Padding";
import getItemsWeight from "shared/util/getItemsWeight";
import network from "shared/network/network";

interface Props extends CommonProps {
	containerId: number;
	isExternal: boolean;
	externalContainerOpen: boolean;
}

export default (props: Props) => {
	const [containers] = useProducerAsState(props.serverState, (state) => state.containers);

	let weight = `0/0kg`;
	const renderedItems: Roact.Element[] = [];

	if (containers[props.containerId]) {
		weight = `${getItemsWeight(containers[props.containerId].content)}/${containers[props.containerId].maxWeight}kg`;
		containers[props.containerId].content.forEach((item, index) => {
			renderedItems.push(
				<frame Size={UDim2.fromScale(1, 0.1)} BackgroundTransparency={1}>
					<Center FillDirection={Enum.FillDirection.Horizontal} />
					<Padding Size={10} />
					<frame Size={UDim2.fromScale(0.7, 1)} BackgroundTransparency={1}>
						<uilistlayout
							FillDirection={Enum.FillDirection.Vertical}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							HorizontalAlignment={Enum.HorizontalAlignment.Left}
						/>

						<Text
							Size={UDim2.fromScale(1, 0.5)}
							Text={item.name}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextYAlignment={Enum.TextYAlignment.Bottom}
							TextColor3={Mocha.Text}
							Weight="Bold"
						/>
						<Text
							Size={UDim2.fromScale(0.3, 0.5)}
							Text={`TYP: ${item.type}`}
							TextColor3={Mocha.Text}
							BackgroundTransparency={0}
							BackgroundColor3={Mocha.Overlay0}
						>
							<uicorner CornerRadius={new UDim(0.1, 0)} />
							<Padding Size={5} />
						</Text>
					</frame>
					<frame Size={UDim2.fromScale(0.3, 1)} BackgroundTransparency={1}>
						<uilistlayout
							FillDirection={Enum.FillDirection.Horizontal}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							HorizontalAlignment={Enum.HorizontalAlignment.Right}
						/>

						<imagebutton
							Size={UDim2.fromScale(1, 1)}
							Image={"rbxassetid://6680261899"}
							BackgroundTransparency={1}
							Rotation={props.isExternal ? 180 : 0}
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
		<frame Size={UDim2.fromScale(0.4875, 1)} BackgroundColor3={Mocha.Base} BackgroundTransparency={0.25}>
			<Center Padding={new UDim(0.025, 0)} />
			<Padding Size={15} />
			<frame Size={UDim2.fromScale(1, 0.05 - 0.025 / 2)} BackgroundTransparency={1}>
				<Center FillDirection={Enum.FillDirection.Horizontal} />
				<Text
					Size={UDim2.fromScale(0.8, 1)}
					Weight="Bold"
					TextXAlignment={Enum.TextXAlignment.Left}
					Text={props.isExternal ? "External" : "Inventory"}
					TextColor3={Mocha.Text}
				/>
				<Text
					Size={UDim2.fromScale(0.2, 1)}
					TextXAlignment={Enum.TextXAlignment.Right}
					Text={weight}
					TextColor3={Mocha.Text}
				/>
			</frame>
			<scrollingframe
				Size={UDim2.fromScale(1, 0.95 - 0.025 / 2)}
				ScrollBarThickness={0}
				BackgroundTransparency={1}
			>
				<uilistlayout />
				{...renderedItems}
			</scrollingframe>
		</frame>
	);
};
