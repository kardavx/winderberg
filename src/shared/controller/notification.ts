import Maid from "@rbxts/maid";
import { Notification } from "shared/data/notificationData";
import network from "shared/network/network";
import { clientProducer } from "./clientPlayerData";

const notification: InitializerFunction = () => {
	const maid = new Maid();

	maid.GiveTask(
		network.PushNotification.connect((notification) => {
			clientProducer.pushNotification(notification as Notification);
		}),
	);

	return () => maid.DoCleaning();
};

export default notification;
