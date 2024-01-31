type Marks = [".", "!", "?"];
const marks: Marks = [".", "!", "?"];

export default (message: string, mark: Marks[number]): string => {
	const lastCharacter = message.sub(-1, -1);
	if (marks.find((mark) => mark === lastCharacter)) return message;

	return `${message}${mark}`;
};
