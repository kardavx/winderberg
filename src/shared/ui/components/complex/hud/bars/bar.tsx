import Roact from "@rbxts/roact";
import Stroke from "shared/ui/components/base/Stroke";
import useSpring from "shared/ui/hook/useSpring";
import palette from "shared/ui/palette/palette";

interface Props {
	icon: string;
	iconXOffset: number;
	progress: number;
	BackgroundColor3: Color3;
	Size: UDim2;
}

export default (props: Props) => {
	const [progress, setProgress] = useSpring({ initialValue: props.progress / 100, stiffness: 60, dampening: 20 });
	setProgress(props.progress / 100);

	return (
		<frame Size={props.Size} BorderSizePixel={0} BackgroundColor3={palette.Base}>
			<Stroke Thickness={2} Color={palette.Text} />
			<frame
				BackgroundColor3={props.BackgroundColor3}
				BorderSizePixel={0}
				Size={progress.map((factor: number) => {
					return UDim2.fromScale(factor, 1);
				})}
			>
				<uigradient
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, new Color3(0.7, 0.7, 0.7)),
							new ColorSequenceKeypoint(1, new Color3(1, 1, 1)),
						])
					}
				/>
			</frame>
			<imagelabel
				ScaleType={Enum.ScaleType.Crop}
				Size={UDim2.fromScale(0.8, 0.8)}
				BackgroundTransparency={1}
				Image={props.icon}
				Position={UDim2.fromScale(0.5 - props.iconXOffset, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
			>
				<uiaspectratioconstraint AspectRatio={1 / 1} />
			</imagelabel>
		</frame>
	);
};
