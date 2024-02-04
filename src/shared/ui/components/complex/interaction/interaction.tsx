import Maid from "@rbxts/maid";
import Roact, { Fragment } from "@rbxts/roact";
import { CollectionService, Workspace } from "@rbxts/services";
import { CommonProps } from "shared/types/UITypes";
import OnKeyHeld from "shared/util/OnKeyHeld";
import useSpring from "shared/ui/hook/useSpring";
import clientSignals from "shared/signal/clientSignals";
import CurrentCamera from "shared/util/CurrentCamera";
import OnKeyClicked from "shared/util/OnKeyClicked";
import interactionData, { defaultIcon, maxInteractionDistance } from "shared/data/interactionData";
import Center from "../../base/Center";
import Padding from "../../base/Padding";
import Text from "../../base/Text";
import LocalPlayer from "shared/util/LocalPlayer";
import interactionModelMock from "./interactionModelMock";
import palette from "shared/ui/palette/palette";
import network from "shared/network/network";

export type AllowedInteractionInstances = BasePart | Model;

const getFocusedInteraction = (): AllowedInteractionInstances | undefined => {
	const FilterDescendantsInstances: Instance[] = [CurrentCamera];
	if (LocalPlayer.Character) FilterDescendantsInstances.push(LocalPlayer.Character);

	const raycastParams = new RaycastParams();
	raycastParams.IgnoreWater = false;
	raycastParams.FilterDescendantsInstances = FilterDescendantsInstances;
	raycastParams.FilterType = Enum.RaycastFilterType.Exclude;

	const raycastResult = Workspace.Raycast(
		CurrentCamera.CFrame.Position,
		CurrentCamera.CFrame.LookVector.mul(maxInteractionDistance),
		raycastParams,
	);

	if (!raycastResult) return;

	if (raycastResult.Instance.HasTag("interaction")) return raycastResult.Instance as AllowedInteractionInstances;
	if (raycastResult.Instance.HasTag("interactionMock")) {
		return raycastResult.Instance.Parent as Model;
	}
};

export default (props: CommonProps) => {
	const [interactionMode, setInteractionMode] = Roact.useState(false);
	const [lastInteractingWith, setLastInteractingWith] = Roact.useBinding(undefined) as LuaTuple<
		[
			Roact.Binding<AllowedInteractionInstances | undefined>,
			(newValue: AllowedInteractionInstances | undefined) => void,
		]
	>;
	const [interactingWith, setInteractingWith] = Roact.useState(undefined) as LuaTuple<
		[
			AllowedInteractionInstances | undefined,
			Roact.Dispatch<Roact.SetStateAction<AllowedInteractionInstances | undefined>>,
		]
	>;
	const [lastRenderedSubInteractions, setLastRenderedSubInteractions] = Roact.useState([]) as unknown as LuaTuple<
		[Roact.Element[], Roact.Dispatch<Roact.SetStateAction<Roact.Element[]>>]
	>;

	const [validatedSubInteractions, setValidatedSubInteractions] = Roact.useBinding(
		{} as { [index: number]: boolean },
	);

	const [subInteractionNames, setSubInteractionNames] = Roact.useBinding({} as { [index: number]: string });

	const [shownFactor, setShownFactor] = useSpring({ initialValue: 0, stiffness: 70, dampening: 20 });
	const [hoveringFactor, setHoveringFactor] = useSpring({ initialValue: 0, stiffness: 120, dampening: 20 });
	const [interactingWithFactor, setInteractingWithFactor] = useSpring({
		initialValue: 0,
		stiffness: 70,
		dampening: 20,
	});

	const interactions = CollectionService.GetTagged("interaction");

	setShownFactor(interactionMode ? 1 : 0);
	if (!interactionMode && interactingWith !== undefined) setInteractingWith(undefined);

	setInteractingWithFactor(interactingWith !== undefined ? 1 : 0);

	if (interactingWith && interactingWith !== lastInteractingWith.getValue()) {
		const newRenderedSubInteractions: Roact.Element[] = [];
		const subInteractions = interactionData[interactingWith.GetAttribute("interactionType") as string];

		subInteractions.forEach((subInteraction, index) => {
			newRenderedSubInteractions.push(
				<textbutton
					Size={UDim2.fromScale(1, 1)}
					Text=""
					LayoutOrder={index}
					Visible={validatedSubInteractions.map((validatedInteractions) => {
						return validatedInteractions[index];
					})}
					AnchorPoint={new Vector2(0, 0.5)}
					AutomaticSize={Enum.AutomaticSize.X}
					BackgroundColor3={palette.Base}
					Event={{
						MouseButton1Click: () => {
							if (subInteraction.functionality) {
								subInteraction.functionality(interactingWith);
							}
							if (subInteraction.serverActionId !== undefined) {
								network.ReplicateInteraction.fire(subInteraction.serverActionId, interactingWith);
							}
							setInteractionMode(false);
						},
					}}
				>
					<uicorner CornerRadius={new UDim(0.25, 0)} />
					<Padding Size={10} />
					<uilistlayout
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						FillDirection={Enum.FillDirection.Horizontal}
						Padding={new UDim(0.05, 0)}
					/>

					<imagelabel
						Size={UDim2.fromScale(1, 1)}
						BackgroundTransparency={1}
						ImageColor3={palette.Text}
						Image={subInteraction.icon !== undefined ? subInteraction.icon : defaultIcon}
						ScaleType={Enum.ScaleType.Crop}
					>
						<uiaspectratioconstraint AspectRatio={1 / 1} />
					</imagelabel>

					<Text
						Text={subInteractionNames.map((names) => names[index])}
						Size={UDim2.fromScale(0.8, 1)}
						TextSize={25}
						CustomTextScaled={true}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextColor3={palette.Text}
						AutomaticSize={Enum.AutomaticSize.X}
					/>
				</textbutton>,
			);
		});

		setLastRenderedSubInteractions(newRenderedSubInteractions);
	}

	setLastInteractingWith(interactingWith);

	if (interactingWith) {
		props.clientState.addMouseEnabler("interactingWith");
	} else {
		props.clientState.removeMouseEnabler("interactingWith");
	}

	Roact.useEffect(() => {
		const maid = new Maid();

		maid.GiveTask(
			OnKeyHeld(
				"interactionMode",
				(held: boolean) => {
					if (held) {
						setInteractionMode(true);
					} else {
						setInteractionMode(false);
					}
				},
				Enum.KeyCode.LeftControl,
			),
		);

		maid.GiveTask(
			OnKeyClicked(
				"interactWith",
				() => {
					if (!interactionMode) return;

					const focusedInteraction = getFocusedInteraction();
					if (!focusedInteraction) return;

					setInteractingWith(focusedInteraction);
				},
				Enum.UserInputType.MouseButton1,
			),
		);

		interactions.forEach((interaction: Instance) => {
			if (!interaction.IsA("BasePart") && !interaction.IsA("Model"))
				error(
					`${interaction.Name} has an incorrect type to be an interaction, accepted types are BasePart and Model, got ${interaction.ClassName}`,
				);

			if (interaction.GetAttribute("interactionType") === undefined)
				error(`${interaction.Name} lacks the interactionType attribute!`);

			if (interaction.IsA("Model")) {
				maid.GiveTask(interactionModelMock(interaction));
			}
		});

		maid.GiveTask(
			clientSignals.onRender.Connect((deltaTime: number) => {
				const currentlyFocusedInteraction = getFocusedInteraction();
				if (currentlyFocusedInteraction !== undefined) {
					setHoveringFactor(1);
					if (currentlyFocusedInteraction === interactingWith) {
						const currentSubInteractions =
							interactionData[interactingWith.GetAttribute("interactionType") as string];

						// validate subinteractions
						const newValidatedSubInteractions: { [index: number]: boolean } = {};
						const newSubInteractionNames: { [index: number]: string } = {};

						currentSubInteractions.forEach((subInteraction, index) => {
							newValidatedSubInteractions[index] =
								subInteraction.validator === undefined ||
								subInteraction.validator(interactingWith) === true
									? true
									: false;
							newSubInteractionNames[index] =
								typeOf(subInteraction.name) === "function"
									? (subInteraction.name as (adornee: AllowedInteractionInstances) => string)(
											interactingWith,
										)
									: (subInteraction.name as string);
						});

						setValidatedSubInteractions(newValidatedSubInteractions);
						setSubInteractionNames(newSubInteractionNames);
					}
				} else {
					setHoveringFactor(0);
					if (interactingWith) setInteractingWith(undefined);
				}
			}),
		);

		return () => maid.DoCleaning();
	});

	return (
		<Fragment>
			<imagelabel
				Image={"rbxassetid://13321848320"}
				Size={UDim2.fromScale(0.06, 0.06)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				ImageColor3={hoveringFactor.map((factor: number) => {
					return palette.Text.Lerp(palette.Blue, factor);
				})}
				Visible={shownFactor.map((factor) => factor > 0.01)}
				ImageTransparency={shownFactor.map((factor: number) => {
					return 1 - factor;
				})}
				Position={UDim2.fromScale(0.5, 0.5)}
				BackgroundTransparency={1}
			>
				<uiaspectratioconstraint AspectRatio={1 / 1} />
			</imagelabel>

			<canvasgroup
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				GroupTransparency={interactingWithFactor.map((factor: number) => 1 - factor)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Visible={interactingWithFactor.map((factor) => factor > 0.01)}
				Position={interactingWithFactor.map((factor: number) => {
					return UDim2.fromScale(0.575, 0.5).Lerp(UDim2.fromScale(0.585, 0.5), factor);
				})}
			>
				<Center />
				<frame Size={UDim2.fromScale(0.13, 0.045)} BackgroundTransparency={1}>
					<uilistlayout Padding={new UDim(0.1, 0)} />
					{...lastRenderedSubInteractions}
				</frame>
			</canvasgroup>
		</Fragment>
	);
};
