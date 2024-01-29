export default (number: number, roundUpFactor: number) => {
	if (roundUpFactor > 1 || roundUpFactor < 0) error(`roundFactor has to be a number between 1 and 0!`);

	const floatingPoint = math.abs(number) - math.abs(math.floor(number));
	if (floatingPoint >= roundUpFactor) {
		return math.ceil(number);
	} else {
		return math.floor(number);
	}
};
