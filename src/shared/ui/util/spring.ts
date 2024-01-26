export default (
	start: number,
	velocity: number,
	goal: number,
	stiffness: number,
	dampening: number,
	precision: number,
	alpha: number,
): LuaTuple<[number, number]> => {
	alpha = math.min(alpha, 0.05);

	const FSpring = -stiffness * (start - goal);
	const FDamper = -dampening * velocity;
	const A = FSpring + FDamper;

	const NewVelocity = velocity + A * alpha;
	const NewPosition = start + NewVelocity * alpha;

	if (math.abs(NewVelocity) < precision && math.abs(start - NewPosition) < precision) {
		return $tuple(goal, 0);
	}

	if (
		NewPosition >= math.huge ||
		NewVelocity >= math.huge ||
		NewPosition !== NewPosition ||
		NewVelocity !== NewVelocity
	) {
		return $tuple(start, velocity);
	}

	return $tuple(NewPosition, NewVelocity);
};
