export type ReactiveValue<T> = {
	set: (callback: (oldValue: T) => T) => void;
	get: () => T;
	subscribe: (callback: (newValue: T, oldValue: T) => void) => () => void;
};

export default <T>(initialValue: T): ReactiveValue<T> => {
	let value = initialValue;
	const subscribers: ((newValue: T, oldValue: T) => void)[] = [];

	return {
		set: (callback) => {
			const previousValue = value;
			const mutated = callback(value);
			if (previousValue === mutated) return;

			value = mutated;
			subscribers.forEach((subscriber) => subscriber(value, previousValue));
		},
		get: () => {
			return value;
		},
		subscribe: (callback) => {
			const index = subscribers.push(callback);

			return () => subscribers.remove(index);
		},
	};
};
