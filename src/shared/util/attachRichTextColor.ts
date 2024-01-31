export default (message: string, color: Color3): string => {
	return `<font color="#${color.ToHex()}">${message}</font>`;
};
