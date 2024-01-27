import { ContextActionService, UserInputService } from "@rbxts/services";

export default (
	bindingName: string,
	callback: (isKeyHeld: boolean) => void,
	...keycodes: Enum.KeyCode[]
): (() => void) => {
	let isHeldOnBind = false;
	[...keycodes].forEach((keycode: Enum.KeyCode) => {
		if (UserInputService.IsKeyDown(keycode)) {
			isHeldOnBind = true;
		}
	});

	callback(isHeldOnBind);

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
