import Roact from "@rbxts/roact";
import clientSignals from "shared/signal/clientSignals";

export default () => {
	const [time, setTime] = Roact.useBinding(tick());

	Roact.useEffect(() => {
		const connection = clientSignals.onRender.Connect((deltaTime: number) => {
			setTime(tick());
		});

		return () => {
			connection.Disconnect();
		};
	});

	return time;
};
