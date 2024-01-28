export default <T>(array: T[], callback: (element: T, index: number) => void) => {
	for (let index = array.size() - 1; index >= 0; index--) {
		callback(array[index], index);
	}
};
