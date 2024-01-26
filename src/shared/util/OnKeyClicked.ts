import { ContextActionService } from "@rbxts/services";

export default (bindingName: string, callback: () => void, ...keycodes: Enum.KeyCode[]): (() => void) => {
	ContextActionService.BindAction(
		bindingName,
		(_, inputState: Enum.UserInputState) => {
			if (inputState !== Enum.UserInputState.Begin) return;

			callback();
		},
		false,
		...keycodes,
	);

	return () => ContextActionService.UnbindAction(bindingName);
};
