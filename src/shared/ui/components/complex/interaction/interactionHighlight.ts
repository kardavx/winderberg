import { Mocha } from "@rbxts/catppuccin";

export default (): Highlight => {
	const highlight = new Instance("Highlight");
	highlight.FillColor = Mocha.Blue;
	highlight.DepthMode = Enum.HighlightDepthMode.Occluded;
	highlight.OutlineColor = Mocha.Sapphire;
	return highlight;
};
