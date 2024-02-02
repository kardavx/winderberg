export interface SerializedVector3 {
	x: number;
	y: number;
	z: number;
}

export interface SerializedCFrame {
	position: SerializedVector3;
	lookVector: SerializedVector3;
}

export const serializeVector3 = (inputVector: Vector3): SerializedVector3 => ({
	x: inputVector.X,
	y: inputVector.Y,
	z: inputVector.Z,
});

export const deserializeVector3 = (serializedVector: SerializedVector3): Vector3 =>
	new Vector3(serializedVector.x, serializedVector.y, serializedVector.z);

export const serializeCFrame = (inputCFrame: CFrame): SerializedCFrame => ({
	position: serializeVector3(inputCFrame.Position),
	lookVector: serializeVector3(inputCFrame.LookVector),
});

export const deserializeCFrame = (serializedCFrame: SerializedCFrame): CFrame => {
	const deserializedPosition = deserializeVector3(serializedCFrame.position);
	const deserializedLookVector = deserializeVector3(serializedCFrame.lookVector);

	return CFrame.lookAt(deserializedPosition, deserializedPosition.add(deserializedLookVector));
};
