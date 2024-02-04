import Maid from "@rbxts/maid";
import { deposit, transfer, withdraw } from "server/module/banking";
import network from "shared/network/network";

const bankingApi: InitializerFunction = () => {
	const maid = new Maid();

	maid.GiveTask(network.Withdraw.connect(withdraw));
	maid.GiveTask(network.Deposit.connect(deposit));
	maid.GiveTask(network.Transfer.connect(transfer));

	return () => maid.DoCleaning();
};

export default bankingApi;
