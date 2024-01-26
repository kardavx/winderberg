export default class cameraModifier {
	static modifiers: cameraModifier[] = [];

	static updateModifiers(deltaTime: number) {
		cameraModifier.modifiers.forEach((modifier: cameraModifier) => {
			modifier.update(deltaTime);
		});
	}

	static getOffsets(): CFrame {
		let offset = CFrame.identity;

		cameraModifier.modifiers.forEach((modifier: cameraModifier) => {
			offset = offset.mul(modifier.get());
		});

		return offset;
	}

	static create(dampened: boolean = false): cameraModifier {
		const id = cameraModifier.modifiers.size() + 1;
		const modifier = new cameraModifier(id, dampened);
		cameraModifier.modifiers.push(modifier);
		return modifier;
	}

	private offset: CFrame = CFrame.identity;
	private constructor(
		private id: number,
		private dampened: boolean,
	) {}

	public set(offset: CFrame) {
		this.offset = offset;
	}

	public get(): CFrame {
		return this.offset;
	}

	public update(deltaTime: number) {
		if (!this.dampened) return;

		this.offset = this.offset.Lerp(CFrame.identity, 5 * deltaTime);
	}

	public destroy() {
		cameraModifier.modifiers.remove(this.id);
		this.offset = CFrame.identity;
	}
}
