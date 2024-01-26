import Roact, { DependencyList } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import spring from "../util/spring";

type Props = {
	initialValue: number;
	speed: number;
	stiffness: number;
	dampening: number;
};

const defaultProps: Props = {
	initialValue: 0,
	speed: 1.7,
	stiffness: 100,
	dampening: 16,
};

export default (
	props: Partial<Props>,
	deps?: DependencyList,
): LuaTuple<[Roact.Binding<number>, (newValue: number) => void, (newValue: number) => void]> => {
	const actualProps: Props = { ...defaultProps, ...props };

	const [target, setTarget] = Roact.useBinding(actualProps.initialValue);
	const [position, setPosition] = Roact.useBinding(actualProps.initialValue);
	const [velocity, setVelocity] = Roact.useBinding(0);

	Roact.useEffect(() => {
		const runServiceConn = RunService.RenderStepped.Connect((deltaTime: number) => {
			const [newPosition, newVelocity] = spring(
				position.getValue(),
				velocity.getValue(),
				target.getValue(),
				actualProps.stiffness,
				actualProps.dampening,
				0.001,
				deltaTime * actualProps.speed,
			);

			setPosition(newPosition);
			setVelocity(newVelocity);
		});

		return () => {
			runServiceConn.Disconnect();
		};
	}, deps);

	return $tuple(position, setTarget, (newValue: number) => {
		setTarget(newValue);
		setPosition(newValue);
		setVelocity(0);
	});
};
