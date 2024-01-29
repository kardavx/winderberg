export default <State>(data: Partial<State>, defaultState: State) => {
	const newData = { ...defaultState, ...data };
	return newData;
};
