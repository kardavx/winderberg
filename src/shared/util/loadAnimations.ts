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

		if (callback) callback(animationTrack, animationName as keyof T);

		animations[animationName as keyof T] = animationTrack;

		animation.Destroy();
	}

	return $tuple(animations, () => {});
};
