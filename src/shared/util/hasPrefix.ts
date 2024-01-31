export default (message: string): boolean => {
	const firstCharacter = message.sub(1, 1);
	if (firstCharacter !== "/") return false;

	return true;
};
