import { ContextActionService } from "@rbxts/services";

export default (
	bindingName: string,
	callback: () => void,
	priority: number,
	...keycodes: (Enum.KeyCode | Enum.UserInputType)[]
): (() => void) => {
	ContextActionService.BindActionAtPriority(
		bindingName,
		(_, inputState: Enum.UserInputState) => {
			if (inputState !== Enum.UserInputState.Begin) return;

			callback();
		},
		false,
		priority,
		...keycodes,
	);

	return () => ContextActionService.UnbindAction(bindingName);
};
