import Maid from "@rbxts/maid";

export type AnimationList = Record<string, number>;

export default <T extends AnimationList>(
	animationList: T,
	adornee: Animator,
	callback?: (animationTrack: AnimationTrack, animationName: keyof T) => void,
): LuaTuple<[Record<keyof T, AnimationTrack>, () => void]> => {
	const maid = new Maid();
	const animations: Record<keyof T, AnimationTrack> = {} as Record<keyof T, AnimationTrack>;

	for (const [animationName, animationId] of pairs(animationList)) {
		const animation = new Instance("Animation");
		animation.AnimationId = `rbxassetid://${animationId}`;

		const animationTrack = adornee.LoadAnimation(animation);
		maid.GiveTask(animationTrack);
		animations[animationName as keyof T] = animationTrack;

		animation.Destroy();
	}

	if (callback) {
		for (const [animationName, animationTrack] of pairs(animations)) {
			task.spawn(() => callback(animationTrack as AnimationTrack, animationName as keyof T));
		}
	}

	return $tuple(animations, () => {});
};
