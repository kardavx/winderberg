export default (model: Model): (() => void) => {
	if (!model.PrimaryPart) {
		error(`Interactions can only be applied to models with primaryParts!`);
	}

	const [modelCFrame, modelSize] = model.GetBoundingBox();

	const mock = new Instance("Part");
	mock.Anchored = false;
	mock.CFrame = modelCFrame;
	mock.CanCollide = false;
	mock.Size = modelSize;
	mock.Transparency = 1;
	mock.Parent = model;
	mock.Name = "interactionMock";
	mock.Massless = true;
	mock.AddTag("interactionMock");

	const weld = new Instance("WeldConstraint");
	weld.Part0 = model.PrimaryPart;
	weld.Part1 = mock;
	weld.Parent = mock;

	return () => {
		weld.Destroy();
		mock.Destroy();
	};
};
