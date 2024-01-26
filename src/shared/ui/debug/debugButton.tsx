import Roact from "@rbxts/roact";
import Padding from "../components/base/Padding";

interface Props {
	Text: string;
	Callback: () => void;
}

export default (props: Props) => {
	return (
		<textbutton
			Text={props.Text}
			AutomaticSize={Enum.AutomaticSize.XY}
			TextScaled={true}
			BackgroundColor3={new Color3(0, 0, 0)}
			BackgroundTransparency={0.7}
			TextColor3={new Color3(1, 1, 1)}
			Event={{
				MouseButton1Click: () => {
					props.Callback();
				},
			}}
		>
			<uitextsizeconstraint MaxTextSize={14} />
			<Padding Size={20} />
		</textbutton>
	);
};
