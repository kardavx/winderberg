import Roact from "@rbxts/roact";
import { CommonProps } from "shared/types/UITypes";
import useProducerAsState from "shared/ui/hook/useProducerAsState";
import palette from "shared/ui/palette/palette";
import Center from "../../base/Center";
import Text from "../../base/Text";
import Padding from "../../base/Padding";
import TextBox from "../../base/TextBox";
import getViewportScaledUdim from "shared/ui/util/getViewportScaledUdim";
import getViewportScaledNumber from "shared/ui/util/getViewportScaledNumber";
import Button from "../../base/Button";
import network from "shared/network/network";

interface Props extends CommonProps {
	accountNumber?: string;
}

export default (props: Props) => {
	const [accountDetails] = useProducerAsState(props.serverState, (state) => state.bankAccounts);

	const [lastBankBalance, setLastBankBalance] = Roact.useBinding(0);
	const [lastTransactionHistory, setLastTransactionHistory] = Roact.useState([] as number[]);

	const [targetAmount, setTargetAmount] = Roact.useBinding(0);
	const [targetAccount, setTargetAccount] = Roact.useBinding("0");

	if (props.accountNumber !== undefined && accountDetails[props.accountNumber]) {
		setLastBankBalance(accountDetails[props.accountNumber].balance);
		if (lastTransactionHistory !== accountDetails[props.accountNumber].history)
			setLastTransactionHistory(accountDetails[props.accountNumber].history);
	}

	const renderedHistory: Roact.Element[] = [];
	lastTransactionHistory.forEach((transaction, index) => {
		renderedHistory.push(
			<frame
				Size={new UDim2(1, 0, 0, getViewportScaledNumber(60))}
				BackgroundTransparency={index % 2 > 0 ? 0.8 : 1}
				BorderSizePixel={0}
				BackgroundColor3={palette.Overlay1}
			>
				<Padding Size={20} />
				<Text
					Size={UDim2.fromScale(1, 1)}
					Text={`${transaction >= 0 ? "+" : ""}${transaction}`}
					TextColor3={transaction >= 0 ? palette.Green : palette.Red}
				/>
			</frame>,
		);
	});

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={palette.Base} BorderSizePixel={0}>
			<Center />
			<frame Size={UDim2.fromScale(1, 0.2)} BackgroundTransparency={1}>
				<Center FillDirection={Enum.FillDirection.Horizontal} />
				<frame Size={UDim2.fromScale(0.6, 1)} BackgroundTransparency={1}>
					<Padding Size={20} />
					<frame
						Size={UDim2.fromScale(1, 1)}
						BackgroundColor3={palette.Overlay1}
						BackgroundTransparency={0.8}
					>
						<uicorner CornerRadius={getViewportScaledUdim(20)} />
						<Text
							Size={UDim2.fromScale(1, 1)}
							TextSize={40}
							Weight="Bold"
							Text={lastBankBalance.map((balance) => tostring(balance))}
						/>
					</frame>
				</frame>
				<frame Size={UDim2.fromScale(0.4, 1)} BackgroundTransparency={1}>
					<Padding Size={20} />
					<frame
						Size={UDim2.fromScale(1, 1)}
						BackgroundColor3={palette.Overlay1}
						BackgroundTransparency={0.8}
					>
						<uicorner CornerRadius={getViewportScaledUdim(20)} />
						<TextBox
							TextEditable={false}
							ClearTextOnFocus={false}
							BackgroundTransparency={1}
							Size={UDim2.fromScale(1, 1)}
							TextSize={40}
							Weight="Bold"
							Text={props.accountNumber}
						/>
					</frame>
				</frame>
			</frame>
			<frame Size={UDim2.fromScale(1, 0.8)} BackgroundTransparency={1}>
				<Center FillDirection={Enum.FillDirection.Horizontal} />
				<frame Size={UDim2.fromScale(0.6, 1)} BackgroundTransparency={1}>
					<Padding Size={20} />
					<frame
						Size={UDim2.fromScale(1, 1)}
						BackgroundColor3={palette.Overlay1}
						BackgroundTransparency={0.8}
					>
						<Padding Size={30} />
						<uicorner CornerRadius={getViewportScaledUdim(20)} />
						<Center Padding={new UDim(0.05, 0)} />
						<Text Size={UDim2.fromScale(1, 0.1)} Text={"Akcje"} />
						<frame Size={UDim2.fromScale(1, 0.85)} BackgroundTransparency={1}>
							<Center />

							<frame Size={UDim2.fromScale(1, 0.3)} BackgroundTransparency={1}>
								<Center FillDirection={Enum.FillDirection.Horizontal} />
								<frame Size={UDim2.fromScale(0.5, 1)} BackgroundTransparency={1}>
									<Padding Size={20} />
									<TextBox
										Size={UDim2.fromScale(1, 1)}
										BackgroundColor3={palette.Overlay1}
										BackgroundTransparency={0.8}
										Text={
											targetAmount.getValue() === undefined
												? ""
												: tostring(targetAmount.getValue())
										}
										TextChanged={(text, textBox) => {
											if (text !== undefined && tonumber(text) === undefined) {
												textBox.Text = tostring(targetAmount.getValue());
											}

											setTargetAmount(tonumber(text) as number);
										}}
									>
										<uicorner CornerRadius={getViewportScaledUdim(20)} />
										<Padding Size={30} />
									</TextBox>
								</frame>
								<frame Size={UDim2.fromScale(0.5, 1)} BackgroundTransparency={1}>
									<Padding Size={20} />
									<TextBox
										Size={UDim2.fromScale(1, 1)}
										BackgroundColor3={palette.Overlay1}
										BackgroundTransparency={0.8}
										Text={targetAccount.getValue()}
										TextChanged={(text, textBox) => {
											if (text !== undefined && tonumber(text) === undefined) {
												textBox.Text = tostring(targetAccount.getValue());
											}

											setTargetAccount(text);
										}}
									>
										<uicorner CornerRadius={getViewportScaledUdim(20)} />
										<Padding Size={30} />
									</TextBox>
								</frame>
							</frame>
							<frame Size={UDim2.fromScale(1, 0.7)} BackgroundTransparency={1}>
								<Center FillDirection={Enum.FillDirection.Horizontal} Padding={new UDim(0.01, 0)} />

								<Button
									Size={UDim2.fromScale(0.3, 1)}
									Text={"Wpłać"}
									BackgroundTransparency={0.8}
									BackgroundColor3={palette.Overlay1}
									TextSize={30}
									Callback={() => {
										const amount = targetAmount.getValue();
										if (amount === 0 || amount === undefined) return;

										network.Deposit.fire(amount);
									}}
								>
									<uicorner CornerRadius={getViewportScaledUdim(20)} />
									<Padding Size={40} />
								</Button>
								<Button
									Size={UDim2.fromScale(0.3, 1)}
									Text={"Wypłać"}
									BackgroundTransparency={0.8}
									BackgroundColor3={palette.Overlay1}
									TextSize={30}
									Callback={() => {
										const amount = targetAmount.getValue();
										if (amount === 0 || amount === undefined) return;

										network.Withdraw.fire(amount);
									}}
								>
									<uicorner CornerRadius={getViewportScaledUdim(20)} />
									<Padding Size={40} />
								</Button>
								<Button
									Size={UDim2.fromScale(0.3, 1)}
									Text={"Przelej"}
									BackgroundTransparency={0.8}
									BackgroundColor3={palette.Overlay1}
									TextSize={30}
									Callback={() => {
										const amount = targetAmount.getValue();
										if (amount === 0 || amount === undefined) return;

										const target = targetAccount.getValue();
										if (target === "0" || target === undefined || tonumber(target) === undefined)
											return;

										network.Transfer.fire(target, amount);
									}}
								>
									<uicorner CornerRadius={getViewportScaledUdim(20)} />
									<Padding Size={40} />
								</Button>
							</frame>
						</frame>
					</frame>
				</frame>
				<frame Size={UDim2.fromScale(0.4, 1)} BackgroundTransparency={1}>
					<Padding Size={20} />
					<frame
						Size={UDim2.fromScale(1, 1)}
						BackgroundColor3={palette.Overlay1}
						BackgroundTransparency={0.8}
					>
						<Padding Size={30} />
						<uicorner CornerRadius={getViewportScaledUdim(20)} />
						<Center Padding={new UDim(0.05, 0)} />
						<Text Size={UDim2.fromScale(1, 0.1)} Text={"Historia"} />
						<scrollingframe
							Size={UDim2.fromScale(1, 0.85)}
							ScrollBarThickness={0}
							CanvasSize={UDim2.fromScale(0, 0)}
							AutomaticCanvasSize={Enum.AutomaticSize.Y}
							BackgroundTransparency={1}
						>
							<uilistlayout
								VerticalAlignment={Enum.VerticalAlignment.Top}
								HorizontalAlignment={Enum.HorizontalAlignment.Center}
							/>

							{renderedHistory}
						</scrollingframe>
					</frame>
				</frame>
			</frame>
		</frame>
	);
};
