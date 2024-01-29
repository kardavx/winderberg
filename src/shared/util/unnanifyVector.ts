import isNan from "./isNan";

export default (vector: Vector3): Vector3 => {
	return new Vector3(isNan(vector.X) ? 0 : vector.X, isNan(vector.Y) ? 0 : vector.Y, isNan(vector.Z) ? 0 : vector.Z);
};
