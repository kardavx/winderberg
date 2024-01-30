import Roact from "@rbxts/roact";
import getViewportScaledNumber from "shared/ui/util/getViewportScaledNumber";
import { weightToFont } from "./Text";

interface Props extends Roact.JsxInstanceProperties<TextBox>, Roact.PropsWithChildren {
	FocusChanged?: (focused: boolean, enterPressed: boolean) => void;
	CustomTextScaled?: boolean;
	forwardedRef?: Roact.Ref<TextBox>;
	Weight?: "Regular" | "Bold";
}

export default (props: Props) => {
	const textSize = props.TextSize !== undefined ? props.TextSize : 14;
	const weight = props.Weight !== undefined ? props.Weight : "Regular";
	const resolution = {
		...(props.CustomTextScaled && { TextScaled: false, TextSize: getViewportScaledNumber(textSize as number) }),
	};
	const properties = {
		...props,
		FocusChanged: undefined,
		CustomTextScaled: undefined,
		Weight: undefined,
		forwardedRef: undefined,
	};

	return (
		<textbox
			TextScaled={true}
			RichText={true}
			Font={weightToFont[weight]}
			ref={props.forwardedRef}
			{...properties}
			{...resolution}
			Event={{
				Focused: () => {
					if (props.FocusChanged) props.FocusChanged(true, false);
				},
				FocusLost: (_, enterPressed: boolean) => {
					if (props.FocusChanged) props.FocusChanged(false, enterPressed);
				},
			}}
		>
			<uitextsizeconstraint MaxTextSize={props.TextSize} />
			{props.children}
		</textbox>
	);
};
