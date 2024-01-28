export const icons = {
	test: "rbxassetid://6908632622",
	crime: "rbxassetid://13865688495",
	strength: "rbxassetid://5044376068",
	money: "rbxassetid://6908632622",
};

export const notificationTime = 10;

export interface Notification {
	title: string;
	description: string;
	icon: keyof typeof icons;
	callback?: () => void;
}

export interface StoredNotification extends Notification {
	pushTick: number;
}
