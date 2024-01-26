import { ContextActionService } from "@rbxts/services";

export default (
	bindingName: string,
	callback: (isKeyHeld: boolean) => void,
	...keycodes: Enum.KeyCode[]
): (() => void) => {
	ContextActionService.BindAction(
		bindingName,
		(_, inputState: Enum.UserInputState) => {
			if (inputState === Enum.UserInputState.Begin) {
				callback(true);
			} else {
				callback(false);
			}
		},
		false,
		...keycodes,
	);

	return () => ContextActionService.UnbindAction(bindingName);
};
