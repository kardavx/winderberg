import Roact from "@rbxts/roact";
import Center from "./Center";
import useSpring from "shared/ui/hook/useSpring";
import { Mocha } from "@rbxts/catppuccin";
import Text from "./Text";
import Padding from "./Padding";
import clientSignals from "shared/signal/clientSignals";

interface Image {
	id: string;
	title: string;
	description: string;
}

interface Props {
	Images: Image[];
}

const autoChangeTime = 2;

export default (props: Props) => {
	const [imageIndex, setImageIndex] = Roact.useState(0);
	const [carouselPosition, setCarouselPosition] = useSpring({
		initialValue: imageIndex,
		stiffness: 40,
		dampening: 20,
	});

	const [nextAutoChange, setNextAutoChange] = Roact.useBinding(tick() + autoChangeTime);

	setCarouselPosition(imageIndex);

	const imageLabels: Roact.Element[] = [];
	const buttons: Roact.Element[] = [];

	props.Images.forEach((image: Image, index: number) => {
		imageLabels.push(
			<imagelabel
				Size={UDim2.fromScale(1, 1)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Image={image.id}
				BorderSizePixel={0}
				BackgroundColor3={new Color3(0, 0, 0)}
				BackgroundTransparency={0.5}
				ScaleType={Enum.ScaleType.Crop}
				Position={carouselPosition.map((position: number) => {
					return UDim2.fromScale(index + 0.5 - position, 0.5);
				})}
			/>,
		);

		buttons.push(
			<textbutton
				Size={UDim2.fromScale(1, 1)}
				Text=""
				AutoButtonColor={false}
				BorderSizePixel={0}
				BackgroundColor3={imageIndex === index ? Mocha.Subtext1 : Mocha.Subtext0}
				Event={{
					MouseButton1Click: () => {
						setNextAutoChange(tick() + autoChangeTime);
						setImageIndex(index);
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={1 / 1} />
				<uicorner CornerRadius={new UDim(0.25, 0)} />
			</textbutton>,
		);
	});

	Roact.useEffect(() => {
		const connection = clientSignals.onRender.Connect(() => {
			if (tick() >= nextAutoChange.getValue()) {
				setNextAutoChange(tick() + autoChangeTime);
				setImageIndex(props.Images[imageIndex + 1] !== undefined ? imageIndex + 1 : 0);
			}
		});

		return () => {
			connection.Disconnect();
		};
	});

	return (
		<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)} ClipsDescendants={true}>
			<Center FillDirection={Enum.FillDirection.Vertical} Padding={new UDim(0.05, 0)} />

			<frame Size={UDim2.fromScale(1, 0.85)} BackgroundTransparency={1}>
				<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
					{imageLabels}
				</frame>

				<frame
					AnchorPoint={new Vector2(0.5, 1)}
					Position={UDim2.fromScale(0.5, 1)}
					Size={UDim2.fromScale(1, 0.2)}
					BorderSizePixel={0}
					BackgroundColor3={new Color3(0, 0, 0)}
					BackgroundTransparency={0.4}
				>
					<Center FillDirection={Enum.FillDirection.Vertical} />
					<Padding Size={10} />

					<Text
						Size={UDim2.fromScale(1, 0.5)}
						TextXAlignment={Enum.TextXAlignment.Left}
						Weight="Bold"
						TextColor3={Mocha.Text}
						Text={props.Images[imageIndex].title}
					/>

					<Text
						Size={UDim2.fromScale(1, 0.5)}
						TextColor3={Mocha.Subtext1}
						TextXAlignment={Enum.TextXAlignment.Left}
						Text={props.Images[imageIndex].description}
					/>
				</frame>
			</frame>
			<frame Size={UDim2.fromScale(1, 0.1)} BackgroundTransparency={1}>
				<Center FillDirection={Enum.FillDirection.Horizontal} Padding={new UDim(0.01, 0)} />

				{buttons}
			</frame>
		</frame>
	);
};
