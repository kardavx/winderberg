import { waitForPlayerProfile, waitForServerState } from "server/controller/serverData";

const generateAccountNumber = (): string => {
	const [suc, serverState] = waitForServerState().await();
	if (!suc) error(`huh?`);

	const producerState = serverState.producer.getState();
	let accountNumber = math.random(11111111, 99999999);
	if (producerState.bankAccounts[tostring(accountNumber)]) {
		while (producerState.bankAccounts[tostring(accountNumber)]) {
			task.wait();
			accountNumber = math.random(11111111, 99999999);
		}
	}

	return tostring(accountNumber);
};

export const createAccount = (): string => {
	const [suc, serverState] = waitForServerState().await();

	if (!suc) error(`Failed to create account`);

	const accountNumber = generateAccountNumber();
	serverState.producer.secureRegisterBankAccount(accountNumber);

	return accountNumber;
};

export const withdraw = (player: Player, amount: number) => {
	waitForPlayerProfile(player).andThen((playerProfile) => {
		const profileState = playerProfile.producer.getState();
		if (profileState.usedBankAccountNumber === undefined) return;

		waitForServerState().andThen((serverState) => {
			if (profileState.usedBankAccountNumber === undefined) return;

			const serverProducerState = serverState.producer.getState();
			if (!serverProducerState.bankAccounts[profileState.usedBankAccountNumber]) return;
			if (!serverProducerState.bankAccounts[profileState.usedBankAccountNumber].isActive) return;
			if (serverProducerState.bankAccounts[profileState.usedBankAccountNumber].balance < amount) return;

			serverState.producer.secureModifyBankAccountBalance(profileState.usedBankAccountNumber, -amount);
			playerProfile.producer.secureModifyMoney(amount);
		});
	});
};

export const deposit = (player: Player, amount: number) => {
	waitForPlayerProfile(player).andThen((playerProfile) => {
		const profileState = playerProfile.producer.getState();
		if (profileState.usedBankAccountNumber === undefined) return;

		waitForServerState().andThen((serverState) => {
			if (profileState.usedBankAccountNumber === undefined) return;

			const serverProducerState = serverState.producer.getState();
			if (!serverProducerState.bankAccounts[profileState.usedBankAccountNumber]) return;
			if (!serverProducerState.bankAccounts[profileState.usedBankAccountNumber].isActive) return;
			if (playerProfile.producer.getState().money < amount) return;

			serverState.producer.secureModifyBankAccountBalance(profileState.usedBankAccountNumber, amount);
			playerProfile.producer.secureModifyMoney(-amount);
		});
	});
};

export const transfer = (player: Player, toAccountNumber: string, amount: number) => {
	waitForPlayerProfile(player).andThen((playerProfile) => {
		const profileState = playerProfile.producer.getState();
		if (profileState.usedBankAccountNumber === undefined) return;

		waitForServerState().andThen((serverState) => {
			if (profileState.usedBankAccountNumber === undefined) return;

			const serverProducerState = serverState.producer.getState();
			if (!serverProducerState.bankAccounts[profileState.usedBankAccountNumber]) return;
			if (!serverProducerState.bankAccounts[profileState.usedBankAccountNumber].isActive) return;
			if (!serverProducerState.bankAccounts[toAccountNumber]) return;
			if (!serverProducerState.bankAccounts[toAccountNumber].isActive) return;
			if (serverProducerState.bankAccounts[profileState.usedBankAccountNumber].balance < amount) return;

			serverState.producer.secureModifyBankAccountBalance(profileState.usedBankAccountNumber, -amount);
			serverState.producer.secureModifyBankAccountBalance(toAccountNumber, amount);
		});
	});
};
