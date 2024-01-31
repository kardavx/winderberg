export default (message: string) => {
	return message.gsub("^%l", string.upper)[0];
};
