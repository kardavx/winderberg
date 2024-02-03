import Maid from "@rbxts/maid";
import { waitForServerState } from "./serverData";
import { createContainer } from "server/module/containers";
import { CollectionService } from "@rbxts/services";

const onStorageAdded = (storage: Instance) => {
	const storageId = storage.GetAttribute("storageId") as string;
	const storageWeight = storage.GetAttribute("storageWeight") as number;
	const storageName = storage.GetAttribute("storageName") as string;

	if (storageId === undefined || storageWeight === undefined) return;

	waitForServerState().andThen((serverState) => {
		const producerState = serverState.producer.getState();
		if (producerState.storageContainerIds[storageId] !== undefined) {
			storage.SetAttribute("containerId", producerState.storageContainerIds[storageId]);
		} else {
			createContainer(storageWeight, storageName).andThen((containerId) => {
				serverState.producer.secureSetStorageContainerId(storageId, containerId);
				storage.SetAttribute("containerId", containerId);
			});
		}
	});
};

const onStorageRemoved = (storage: Instance) => {
	storage.SetAttribute("containerId", undefined);
};

const storage: InitializerFunction = () => {
	const maid = new Maid();

	CollectionService.GetTagged("storage").forEach(onStorageAdded);
	maid.GiveTask(CollectionService.GetInstanceAddedSignal("storage").Connect(onStorageAdded));
	maid.GiveTask(CollectionService.GetInstanceRemovedSignal("storage").Connect(onStorageRemoved));

	return () => maid.DoCleaning();
};

export default storage;
