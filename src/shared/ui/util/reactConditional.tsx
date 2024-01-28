import Roact from "@rbxts/roact";

export default (condition: boolean, element: Roact.Element) => {
	return condition ? element : undefined;
};
