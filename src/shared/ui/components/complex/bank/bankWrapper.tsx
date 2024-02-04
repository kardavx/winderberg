import Roact from "@rbxts/roact";
import { CommonProps } from "shared/types/UITypes";
import useProducerAsState from "shared/ui/hook/useProducerAsState";
import GenericPopup from "../../base/GenericPopup";
import Bank from "./bank";
import getViewportScaledUdim from "shared/ui/util/getViewportScaledUdim";

export default (props: CommonProps) => {
	const [openAccountNumber] = useProducerAsState(props.serverProfile, (state) => state.usedBankAccountNumber);

	if (openAccountNumber !== undefined) {
		props.clientState.addMouseEnabler("bank");
	} else {
		props.clientState.removeMouseEnabler("bank");
	}

	return (
		<GenericPopup
			HiddenSize={UDim2.fromScale(0.65, 0.7)}
			Size={UDim2.fromScale(0.7, 0.7)}
			Visible={openAccountNumber !== undefined}
		>
			<uicorner CornerRadius={getViewportScaledUdim(20)} />
			<Bank {...props} accountNumber={openAccountNumber} />
		</GenericPopup>
	);
};
