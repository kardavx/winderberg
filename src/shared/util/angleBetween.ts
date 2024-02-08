// local function AngleBetween(vectorA, vectorB)
// 	return math.acos(math.clamp(vectorA:Dot(vectorB), -1, 1))
// end

export default (vectorA: Vector3, vectorB: Vector3): number => {
	return math.acos(math.clamp(vectorA.Dot(vectorB), -1, 1));
};
