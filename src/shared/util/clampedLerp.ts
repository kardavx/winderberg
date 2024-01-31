import { lerp } from "@rbxts/pretty-react-hooks";

export default (...args: Parameters<typeof lerp>) => math.clamp(lerp(...args), 0, 1);
