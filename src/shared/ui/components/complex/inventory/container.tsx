import Roact from "@rbxts/roact";
import Center from "../../base/Center";
import Text from "../../base/Text";
import Padding from "../../base/Padding";
import getViewportScaledNumber from "shared/ui/util/getViewportScaledNumber";
import palette from "shared/ui/palette/palette";
import { Mocha } from "@rbxts/catppuccin";
import { ContainerSchema } from "shared/types/ContainerTypes";

interface Props {
	container: ContainerSchema;
	equippedItems: number[];
	lmbDoubleClickCallback?: (index: number) => void;
	lmbCallback: (index: number) => void;
}

const doubleClickWindow = 0.5;

export default (props: Props) => {
	const renderedItems: Roact.Element[] = [];
	let lastClicked: { index: number; tick: number } | undefined = undefined;

	if (props.container) {
		props.container.content.forEach((item, index) => {
			renderedItems.push(
				<frame
					Size={new UDim2(1, 0, 0, getViewportScaledNumber(80))}
					BackgroundTransparency={index % 2 > 0 ? 0.8 : 1}
					BorderSizePixel={0}
					BackgroundColor3={palette.Overlay1}
					Event={{
						InputBegan: (_, inputObject: InputObject) => {
							if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;

							if (props.lmbDoubleClickCallback) {
								if (lastClicked) {
									if (lastClicked.index === index) {
										if (tick() - lastClicked.tick <= doubleClickWindow) {
											props.lmbDoubleClickCallback(index);
											lastClicked = undefined;
										}
									}
								}
								lastClicked = { index, tick: tick() };
							}

							props.lmbCallback(index);
						},
					}}
				>
					<Center FillDirection={Enum.FillDirection.Horizontal} />
					<Padding Size={10} />
					<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
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
							Text={`${item.name} ${props.equippedItems.includes(item.id) ? `(W UŻYCIU)` : ""}`}
							CustomTextScaled={true}
							TextWrapped={true}
							Weight="Bold"
							TextSize={22}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextYAlignment={Enum.TextYAlignment.Center}
							TextColor3={palette.Text}
						/>
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
