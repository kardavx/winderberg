import Roact from "@rbxts/roact";
import getViewportScaledNumber from "shared/ui/util/getViewportScaledNumber";

interface Props extends Roact.JsxInstanceProperties<UIStroke> {
	Thickness: number;
}

export default (props: Props) => {
	return <uistroke {...props} Thickness={getViewportScaledNumber(props.Thickness)} />;
};
