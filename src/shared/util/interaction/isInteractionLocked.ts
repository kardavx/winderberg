import { AllowedInteractionInstances } from "shared/ui/components/complex/interaction/interaction";

export default (adornee: AllowedInteractionInstances): boolean => {
	const carRef = adornee.FindFirstChild("Car") as ObjectValue;
	let actualAdornee: Instance;

	if (carRef) {
		actualAdornee = carRef.Value as Instance;
	} else {
		actualAdornee = adornee;
	}

	return (actualAdornee.GetAttribute("locked") as boolean | undefined) || false;
};
