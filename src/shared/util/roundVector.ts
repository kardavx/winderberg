export default (vector: Vector3, roundUpFactor: number = 0.5): Vector3 => {
	return new Vector3(math.round(vector.X), math.round(vector.Y), math.round(vector.Z));
};
