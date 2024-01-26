export default (current: number, target: number, alpha: number): number => {
	return current + (target - current) * alpha;
};
