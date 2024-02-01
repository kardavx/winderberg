import Roact from "@rbxts/roact";
import clientSignals from "shared/signal/clientSignals";

interface Props extends Roact.JsxInstanceProperties<Frame>, Roact.PropsWithChildren {
	Static: Roact.Binding<boolean>;
	GroupTransparency?: number | Roact.Binding<number>;
}

export default (props: Props) => {
	const [isStatic, setIsStatic] = Roact.useState(props.Static.getValue());

	const baseProps = { ...props, Static: undefined, GroupTransparency: undefined };
	const canvasProps = { GroupTransparency: props.GroupTransparency };

	Roact.useEffect(() => {
		const conn = clientSignals.onRender.Connect((deltaTime: number) => {
			if (isStatic !== props.Static.getValue()) setIsStatic(props.Static.getValue());
		});

		return () => conn.Disconnect();
	});

	if (isStatic) {
		return <frame {...baseProps}>{props.children}</frame>;
	} else {
		return (
			<canvasgroup {...baseProps} {...canvasProps}>
				{props.children}
			</canvasgroup>
		);
	}
};
