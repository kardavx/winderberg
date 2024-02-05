import Roact from "@rbxts/roact";
import { CommonProps } from "shared/types/UITypes";
import useProducerAsState from "shared/ui/hook/useProducerAsState";
import GenericPopup from "../../base/GenericPopup";
import Center from "../../base/Center";
import Maid from "@rbxts/maid";
import OnKeyClicked from "shared/util/OnKeyClicked";
import Container from "./container";
import palette from "shared/ui/palette/palette";
import Text from "../../base/Text";
import Padding from "../../base/Padding";
import Stroke from "../../base/Stroke";
import Button from "../../base/Button";
import getViewportScaledUdim from "shared/ui/util/getViewportScaledUdim";
import getItemsWeight from "shared/util/getItemsWeight";
import clampedInverseLerp from "shared/util/clampedInverseLerp";
import useSpring from "shared/ui/hook/useSpring";
import network from "shared/network/network";

const springParams = { initialValue: 0, stiffness: 60, dampening: 20 };

export default (props: CommonProps) => {
	const [isOpen] = useProducerAsState(props.clientState, (state) => state.inventoryOpen);
	const [inventoryContainerId] = useProducerAsState(props.serverProfile, (state) => state.inventoryContainerId);
	const [externalContainerId] = useProducerAsState(props.serverProfile, (state) => state.externalContainerId);

	const [inventoryContainer] = useProducerAsState(
		props.serverState,
		(state) => state.containers[inventoryContainerId !== undefined ? inventoryContainerId : math.huge],
	);

	const [externalContainer] = useProducerAsState(
		props.serverState,
		(state) => state.containers[externalContainerId !== undefined ? externalContainerId : math.huge],
	);

	const [inventoryWeightFactor, setInventoryWeightFactor] = useSpring(springParams);
	const [externalWeightFactor, setExternalWeightFactor] = useSpring(springParams);

	if (inventoryContainer !== undefined) {
		const newWeightFactor = clampedInverseLerp(
			0,
			inventoryContainer.maxWeight,
			getItemsWeight(inventoryContainer.content),
		);

		setInventoryWeightFactor(newWeightFactor);
	}

	if (externalContainer !== undefined) {
		const newWeightFactor = clampedInverseLerp(
			0,
			externalContainer.maxWeight,
			getItemsWeight(externalContainer.content),
		);

		setExternalWeightFactor(newWeightFactor);
	}

	if (isOpen) {
		props.clientState.addMouseEnabler("inventory");
	} else {
		props.clientState.removeMouseEnabler("inventory");
	}

	let renderedInventory: Roact.Element | undefined;
	let renderedExternalContainer: Roact.Element | undefined;

	const renderedEquipped: Roact.Element[] = [];
	for (let i = 0; i < 3; i++) {
		renderedEquipped.push(
			<Button
				Size={UDim2.fromScale(0.33, 1)}
				BackgroundColor3={palette.Overlay1}
				BackgroundTransparency={0.8}
				BorderSizePixel={0}
				Text=""
				Callback={() => {}}
			>
				<uiaspectratioconstraint AspectRatio={1 / 1} />
			</Button>,
		);
	}

	if (inventoryContainerId !== undefined)
		renderedInventory = (
			<frame
				Size={UDim2.fromScale(0.6, 1)}
				BackgroundColor3={palette.Base}
				BorderSizePixel={0}
				BackgroundTransparency={0.25}
			>
				<Center />
				<frame
					Size={UDim2.fromScale(1, 0.06)}
					BackgroundColor3={palette.Mantle}
					BackgroundTransparency={0.5}
					BorderSizePixel={0}
				>
					<Padding Size={10} />
					<Text Size={UDim2.fromScale(1, 1)} TextXAlignment={Enum.TextXAlignment.Left} Text={"Inventory"} />
				</frame>
				<frame Size={UDim2.fromScale(1, 0.85)} BackgroundTransparency={1}>
					<Padding Size={10} />
					<Center FillDirection={Enum.FillDirection.Horizontal} />
					<frame Size={UDim2.fromScale(0.5, 1)} BackgroundTransparency={1}>
						<Center Padding={new UDim(0.01, 0)} />
						<frame Size={UDim2.fromScale(1, 0.19)} BackgroundTransparency={1}>
							<Center Padding={getViewportScaledUdim(10)} FillDirection={Enum.FillDirection.Horizontal} />
							{renderedEquipped}
						</frame>
						<frame Size={UDim2.fromScale(1, 0.8)} BackgroundTransparency={1}>
							<Container
								container={inventoryContainer}
								lmbCallback={(index) => {
									if (externalContainerId !== undefined) {
										network.TransferItem.fire("External", index);
									}
								}}
							/>
						</frame>
					</frame>
					<frame Size={UDim2.fromScale(0.5, 1)} BackgroundTransparency={1}>
						<frame
							Size={UDim2.fromScale(1, 1)}
							BackgroundColor3={palette.Overlay1}
							BorderSizePixel={0}
							BackgroundTransparency={0.8}
						/>
					</frame>
				</frame>
				<frame Size={UDim2.fromScale(1, 0.09)} BackgroundTransparency={1}>
					<Padding Size={10} />
					<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
						<Stroke Thickness={2} Color={palette.Text} />
						<frame
							Size={inventoryWeightFactor.map((factor) => UDim2.fromScale(factor, 1))}
							AnchorPoint={new Vector2(0, 0.5)}
							Position={UDim2.fromScale(0, 0.5)}
							BorderSizePixel={0}
							BackgroundColor3={palette.Text}
						/>
					</frame>
				</frame>
			</frame>
		);

	if (externalContainerId !== undefined)
		renderedExternalContainer = (
			<frame
				Size={UDim2.fromScale(0.3, 1)}
				BackgroundColor3={palette.Base}
				BorderSizePixel={0}
				BackgroundTransparency={0.25}
			>
				<Center />
				<frame
					Size={UDim2.fromScale(1, 0.06)}
					BackgroundColor3={palette.Mantle}
					BackgroundTransparency={0.5}
					BorderSizePixel={0}
				>
					<Padding Size={10} />
					<Text Size={UDim2.fromScale(1, 1)} TextXAlignment={Enum.TextXAlignment.Left} Text={"External"} />
				</frame>
				<frame Size={UDim2.fromScale(1, 0.85)} BackgroundTransparency={1}>
					<Padding Size={10} />
					<Container
						container={externalContainer}
						lmbCallback={(index) => {
							network.TransferItem.fire("Inventory", index);
						}}
					/>
				</frame>
				<frame Size={UDim2.fromScale(1, 0.09)} BackgroundTransparency={1}>
					<Padding Size={10} />
					<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
						<Stroke Thickness={2} Color={palette.Text} />
						<frame
							Size={externalWeightFactor.map((factor) => UDim2.fromScale(factor, 1))}
							AnchorPoint={new Vector2(0, 0.5)}
							Position={UDim2.fromScale(0, 0.5)}
							BorderSizePixel={0}
							BackgroundColor3={palette.Text}
						/>
					</frame>
				</frame>
			</frame>
		);

	Roact.useEffect(() => {
		const maid = new Maid();

		maid.GiveTask(
			OnKeyClicked("inventoryOpen", () => props.clientState.setInventoryOpen(!isOpen), Enum.KeyCode.Tab),
		);

		maid.GiveTask(
			props.clientState.subscribe(
				(state) => state.inventoryOpen,
				(isInventoryOpen) => {
					if (!isInventoryOpen && props.serverProfile.getState().externalContainerId !== undefined) {
						props.serverProfile.closeExternalContainer();
					}
				},
			),
		);

		maid.GiveTask(
			props.serverProfile.subscribe(
				(state) => state.externalContainerId,
				(containerId) => {
					if (containerId !== undefined && props.clientState.getState().inventoryOpen === false) {
						props.clientState.setInventoryOpen(true);
					}
				},
			),
		);

		return () => maid.DoCleaning();
	});

	return (
		<GenericPopup Visible={isOpen} HiddenSize={UDim2.fromScale(0.65, 0.7)} Size={UDim2.fromScale(0.7, 0.7)}>
			<Center FillDirection={Enum.FillDirection.Horizontal} Padding={new UDim(0.025, 0)} />
			{/* <frame
				Size={UDim2.fromScale(0.4875, 1)}
				BackgroundColor3={palette.Base}
				BorderSizePixel={0}
				BackgroundTransparency={0.25}
			>
				{renderedExternalContainer}
			</frame> */}

			{renderedExternalContainer}
			{renderedInventory}
		</GenericPopup>
	);
};
