import network from "shared/network/network";
import LocalPlayer from "shared/util/LocalPlayer";

const replicationTest: InitializerFunction = () => {
	network.TestReplicate.fire(`Hey, i'm alive and i belong to ${LocalPlayer.Name}!`);

	return () => {};
};

export default replicationTest;
