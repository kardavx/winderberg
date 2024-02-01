import Roact from "@rbxts/roact";
import { CommonProps } from "shared/types/UITypes";
import useProducerAsState from "shared/ui/util/useProducerAsState";
import GenericPopup from "../../base/GenericPopup";
import Center from "../../base/Center";
import Maid from "@rbxts/maid";
import OnKeyClicked from "shared/util/OnKeyClicked";
import Container from "./container";

export default (props: CommonProps) => {
	const [isOpen] = useProducerAsState(props.clientState, (state) => state.inventoryOpen);
	const [inventoryContainerId] = useProducerAsState(props.serverProfile, (state) => state.inventoryContainerId);
	const [externalContainerId] = useProducerAsState(props.serverProfile, (state) => state.externalContainerId);

	if (!isOpen && externalContainerId !== undefined) props.serverProfile.closeExternalContainer();

	if (isOpen) {
		props.clientState.addMouseEnabler("inventory");
	} else {
		props.clientState.removeMouseEnabler("inventory");
	}

	let renderedInventory: Roact.Element | undefined;
	let renderedExternalContainer: Roact.Element | undefined;

	if (inventoryContainerId !== undefined)
		renderedInventory = (
			<Container
				containerId={inventoryContainerId}
				isExternal={false}
				externalContainerOpen={externalContainerId !== undefined}
				{...props}
			/>
		);

	if (externalContainerId !== undefined)
		renderedExternalContainer = (
			<Container
				containerId={externalContainerId}
				isExternal={true}
				externalContainerOpen={externalContainerId !== undefined}
				{...props}
			/>
		);

	Roact.useEffect(() => {
		const maid = new Maid();

		maid.GiveTask(
			OnKeyClicked("inventoryOpen", () => props.clientState.setInventoryOpen(!isOpen), Enum.KeyCode.Tab),
		);

		return () => maid.DoCleaning();
	});

	return (
		<GenericPopup Visible={isOpen} HiddenSize={UDim2.fromScale(0.65, 0.7)} Size={UDim2.fromScale(0.7, 0.7)}>
			<Center FillDirection={Enum.FillDirection.Horizontal} Padding={new UDim(0.025, 0)} />
			{renderedInventory}
			{renderedExternalContainer}
		</GenericPopup>
	);
};
