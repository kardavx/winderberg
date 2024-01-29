import Roact from "@rbxts/roact";
import { CommonProps } from "shared/types/UITypes";
import Notification from "./notification";
import useProducerAsState from "shared/ui/util/useProducerAsState";
import clientSignals from "shared/signal/clientSignals";
import { notificationTime } from "shared/data/notificationData";

export default (props: CommonProps) => {
	const [notifications] = useProducerAsState(props.clientState, (state) => {
		return state.notifications;
	});

	const renderedNotifications: Roact.Element[] = [];
	notifications.forEach((notification, index) => {
		renderedNotifications.push(
			<Notification
				title={notification.title}
				description={notification.description}
				icon={notification.icon}
				callback={() => {
					props.clientState.removeNotification(index);
					if (notification.callback) notification.callback();
				}}
			/>,
		);
	});

	Roact.useEffect(() => {
		const connection = clientSignals.onRender.Connect(() => {
			notifications.forEach((notification, index) => {
				if (tick() >= notification.pushTick + notificationTime) props.clientState.removeNotification(index);
			});
		});

		return () => {
			connection.Disconnect();
		};
	});

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
			<uilistlayout
				Padding={new UDim(0.08, 0)}
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
			/>

			{...renderedNotifications}
		</frame>
	);
};
