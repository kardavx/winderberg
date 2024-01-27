// local ReplicatedStorage = game:GetService("ReplicatedStorage")

import { Producer } from "@rbxts/reflex";
import Roact from "@rbxts/roact";

// local React = require(ReplicatedStorage.package.React)

// local function useProducerAsState<State, Dispatchers, Comparison>(producer, getSlice: (state: State) -> Comparison, dependencies: { any? }?)
// 	local value, setValue = React.useState(getSlice(producer:getState()))
// 	local lastValue, setLastValue = React.useState(getSlice(producer:getState()))

// 	debug.profilebegin("useProducerAsState")

// 	React.useEffect(function()
// 		-- jeśli dependencies się zaktualizują, state musi się zaktualizować
// 		setValue(getSlice(producer:getState()))

// 		local disconnect = producer:subscribe(getSlice, function(newValue: Comparison, lastValue: Comparison)
// 			setValue(newValue)
// 			setLastValue(lastValue)
// 		end)

// 		return disconnect
// 	end, dependencies)

// 	debug.profileend()

// 	return value, lastValue
// end

// return useProducerAsState

type SliceState<State> = State & { [key in string]: unknown };

export default <State, Comparison>(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	producer: Producer<any>,
	getSlice: (state: SliceState<State>) => Comparison,
	dependencies?: unknown[],
) => {
	const [value, setValue] = Roact.useState(getSlice(producer.getState() as SliceState<State>));
	const [lastValue, setLastValue] = Roact.useState(getSlice(producer.getState() as SliceState<State>));

	debug.profilebegin("useProducerAsState");

	Roact.useEffect(() => {
		setValue(getSlice(producer.getState() as SliceState<State>));

		const disconnect = producer.subscribe(
			getSlice as (state: unknown) => Comparison,
			(newValue: Comparison, lastValue: Comparison) => {
				setValue(newValue);
				setLastValue(lastValue);
			},
		);

		return disconnect;
	}, dependencies);

	debug.profileend();

	return $tuple(value, lastValue);
};
