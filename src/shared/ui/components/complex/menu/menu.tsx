import Roact from "@rbxts/roact";
import { CommonProps } from "shared/types/UITypes";
import Text from "../../base/Text";
import Center from "../../base/Center";
import { Mocha } from "@rbxts/catppuccin";
import StatusIcon from "./statusIcon";
import Carousel from "../../base/Carousel";
import { setInterval } from "@rbxts/set-timeout";

export default (props: CommonProps) => {
	const [active, setActive] = Roact.useState(false);
	const tipTitle = "Czy wiesz że...";

	Roact.useEffect(() => {
		const cleanup = setInterval(() => {
			setActive(!active);
		}, 15);

		return cleanup;
	});

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
			<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
				<Center FillDirection={Enum.FillDirection.Vertical} />

				<imagelabel
					Size={UDim2.fromScale(0.4, 0.4)}
					BackgroundTransparency={1}
					ImageColor3={Mocha.Text}
					ScaleType={Enum.ScaleType.Crop}
					Image={"rbxassetid://16130691292"}
				>
					<uiaspectratioconstraint AspectRatio={23 / 9} />
				</imagelabel>

				<frame Size={UDim2.fromScale(0.4, 0.2)} BackgroundTransparency={1}>
					<Center />

					<Text
						Text={string.upper("JESTEŚMY AKTUALNIE")}
						TextColor3={Mocha.Subtext0}
						Weight="Bold"
						TextSize={40}
						Size={UDim2.fromScale(1, 0.25)}
					/>

					<frame Size={UDim2.fromScale(1, 0.25)} BackgroundTransparency={1}>
						<Center FillDirection={Enum.FillDirection.Horizontal} />

						<StatusIcon isActive={active} />
						<Text
							TextColor3={active === true ? Mocha.Green : Mocha.Red}
							TextSize={30}
							Text={string.upper(`${active === true ? "ONLINE" : "OFFLINE"}`)}
							Size={UDim2.fromScale(0.2, 1)}
						/>
					</frame>
				</frame>

				<frame Size={UDim2.fromScale(0.4, 0.4)} BackgroundTransparency={1} Visible={!active}>
					<Carousel
						Images={[
							{
								id: "rbxassetid://6364344573",
								title: tipTitle,
								description: "Udając się do urzędu miasta możesz wyrobić wszystkie dokumenty?",
							},
							{
								id: "rbxassetid://6856822317",
								title: tipTitle,
								description: "Udając się do ośrodka nauki jazdy możesz wyrobić uprawnienia",
							},
							{
								id: "rbxassetid://14666034302",
								title: tipTitle,
								description: "PolskiPony wyjebał się za 0 na wbv1",
							},
						]}
					/>
				</frame>
			</frame>

			<frame
				Size={UDim2.fromScale(1, 1)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				ZIndex={-1}
				BackgroundColor3={Mocha.Base}
			>
				<uigradient
					Transparency={
						new NumberSequence([
							new NumberSequenceKeypoint(0, 1),
							new NumberSequenceKeypoint(0.25, 0.3),
							new NumberSequenceKeypoint(0.5, 0.2),
							new NumberSequenceKeypoint(0.75, 0.3),
							new NumberSequenceKeypoint(1, 1),
						])
					}
				/>
			</frame>
		</frame>
	);
};
