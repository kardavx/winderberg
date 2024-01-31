import inverseLerp from "./inverseLerp";

export default (...args: Parameters<typeof inverseLerp>) => math.clamp(inverseLerp(...args), 0, 1);
