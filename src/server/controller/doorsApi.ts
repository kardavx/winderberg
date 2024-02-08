import Maid from "@rbxts/maid";
import { CollectionService } from "@rbxts/services";

const doorsApi: InitializerFunction = () => {
	const maid = new Maid();
	const doors: {
		interaction: Instance;
		maid: Maid;
	}[] = [];

	let lastId: number;
	const getId = () => {
		if (lastId === undefined) {
			lastId = 0;
		} else {
			lastId++;
		}

		return lastId;
	};

	const onDoorAdded = (interaction: Instance) => {
		if (!interaction.IsA("Model")) return;
		if (!interaction.PrimaryPart) return;

		interaction.SetAttribute("Open", false);
		interaction.SetAttribute("Locked", false);
		interaction.SetAttribute("RotationMultiplier", 1);

		const doorId = getId();
		interaction.SetAttribute("id", doorId);

		const doorMaid = new Maid();
		const basePivot = interaction.GetPivot();

		doorMaid.GiveTask(
			interaction.GetAttributeChangedSignal("Open").Connect(() => {
				interaction.PivotTo(
					basePivot.mul(
						CFrame.Angles(
							0,
							math.rad(
								interaction.GetAttribute("Open") === true
									? 90 * (interaction.GetAttribute("RotationMultiplier") as number)
									: 0,
							),
							0,
						),
					),
				);
			}),
		);

		doorMaid.GiveTask(
			interaction.GetAttributeChangedSignal("Locked").Connect(() => {
				interaction.SetAttribute("Open", false);
			}),
		);

		doors[doorId] = {
			interaction,
			maid: doorMaid,
		};
	};

	CollectionService.GetTagged("interaction").forEach((interaction) => {
		if (interaction.GetAttribute("interactionType") !== "Door") return;
		onDoorAdded(interaction);
	});

	maid.GiveTask(
		CollectionService.GetInstanceAddedSignal("interaction").Connect((interaction) => {
			if (interaction.GetAttribute("interactionType") !== "Door") return;
			onDoorAdded(interaction);
		}),
	);

	maid.GiveTask(
		CollectionService.GetInstanceRemovedSignal("interaction").Connect((interaction) => {
			if (interaction.GetAttribute("interactionType") !== "Door") return;
			const doorId = interaction.GetAttribute("id") as number;
			if (doorId === undefined) return;

			doors[doorId].maid.DoCleaning();
			delete doors[doorId];
		}),
	);

	return () => maid.DoCleaning();
};

export default doorsApi;
