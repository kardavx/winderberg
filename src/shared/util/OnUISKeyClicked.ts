import { UserInputService } from "@rbxts/services";

export default (callback: () => void, keycode: Enum.KeyCode) => {
	return UserInputService.InputBegan.Connect((inputObject: InputObject) => {
		if (inputObject.KeyCode === keycode) callback();
	});
};
