import { Producer } from "@rbxts/reflex";
import Roact from "@rbxts/roact";

export default <State extends Slice, Actions, Slice>(
	producer: Producer<State, Actions>,
	getSlice: (state: State) => Slice,
	dependencies?: unknown[],
) => {
	const state = getSlice(producer.getState()) as Slice;
	const [value, setValue] = Roact.useBinding(state);

	Roact.useEffect(() => {
		debug.profilebegin("useProducerAsBinding");

		const effect_state = getSlice(producer.getState()) as Slice;
		setValue(effect_state);

		const disconnect = producer.subscribe(getSlice, (newValue: Slice, lastValue: Slice) => {
			setValue(newValue);
		});

		debug.profileend();

		return disconnect;
	}, dependencies);

	return $tuple(value);
};
