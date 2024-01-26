import Roact from "@rbxts/roact";
import { CommonProps } from "shared/types/UITypes";
import FullscreenFrame from "../../base/FullscreenFrame";
import { Mocha } from "@rbxts/catppuccin";
import useSpring from "shared/ui/hook/useSpring";
import Text from "../../base/Text";
import MenuServerButton from "./serverButton/menuServerButton";
import Padding from "../../base/Padding";
import DebugButton from "shared/ui/debug/debugButton";

const queueOutSize = UDim2.fromScale(1.7, 1.7);
const queueNormalSize = UDim2.fromScale(1, 1);

export default (props: CommonProps) => {
	const [fadeIn, setFadeIn, overrideFadeIn] = useSpring({ initialValue: 1, stiffness: 35, dampening: 20 });
	const [queueFactor, setQueueFactor, overrideQueueFactor] = useSpring({
		initialValue: 1,
		stiffness: 60,
		dampening: 20,
	});

	overrideQueueFactor(1);
	overrideFadeIn(1);
	setFadeIn(0);

	return (
		<FullscreenFrame BackgroundColor3={Mocha.Base}>
			<canvasgroup
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={fadeIn.map((factor: number) => {
					return UDim2.fromScale(0.5, 0.5).Lerp(UDim2.fromScale(0.5, 0.7), factor);
				})}
				Size={fadeIn.map((factor: number) => {
					return UDim2.fromScale(1, 1).Lerp(UDim2.fromScale(0.8, 1), factor);
				})}
				GroupTransparency={fadeIn.map((transparency: number) => transparency)}
				BackgroundTransparency={1}
			>
				<Padding Size={100} />

				<canvasgroup
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					BackgroundTransparency={1}
					GroupTransparency={queueFactor.map((transparency: number) => 1 - transparency)}
					Size={queueFactor.map((factor: number) => {
						return queueOutSize.Lerp(queueNormalSize, factor);
					})}
				>
					<uilistlayout
						VerticalAlignment={Enum.VerticalAlignment.Center}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
					/>

					<Text
						Text={"Wybierz odpowiedni serwer"}
						TextColor3={Mocha.Text}
						Size={UDim2.fromScale(1, 0.15)}
						Weight="Bold"
						TextSize={40}
					/>
					<frame Size={UDim2.fromScale(1, 0.85)} BackgroundTransparency={1}>
						<uilistlayout
							Padding={new UDim(0.025, 0)}
							FillDirection={Enum.FillDirection.Horizontal}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
						/>

						<MenuServerButton
							isActive={true}
							serverName="Produkcyjny"
							Callback={() => {
								setQueueFactor(0);
							}}
						/>
						<MenuServerButton
							isActive={false}
							serverName="Developerski"
							Callback={() => {
								setQueueFactor(0);
							}}
						/>
					</frame>
				</canvasgroup>
				<canvasgroup
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					BackgroundTransparency={1}
					GroupTransparency={queueFactor.map((transparency: number) => transparency)}
					Size={queueFactor.map((factor: number) => {
						return queueNormalSize.Lerp(queueOutSize, factor);
					})}
				>
					<uilistlayout
						VerticalAlignment={Enum.VerticalAlignment.Center}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
					/>

					<Text
						Text={"Jesteś (0/130) w kolejce, dziekujemy za cierpliwość!"}
						TextColor3={Mocha.Text}
						Size={UDim2.fromScale(1, 0.1)}
						Weight="Bold"
						TextSize={40}
					/>

					<DebugButton
						Text="Wróć"
						Callback={() => {
							setQueueFactor(1);
						}}
					/>
				</canvasgroup>
			</canvasgroup>
		</FullscreenFrame>
	);
};
