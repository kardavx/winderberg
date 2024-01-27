import Maid from "@rbxts/maid";
import Roact, { Fragment } from "@rbxts/roact";
import { CollectionService, Workspace } from "@rbxts/services";
import { CommonProps } from "shared/types/UITypes";
import OnKeyHeld from "shared/util/OnKeyHeld";
import interactionHighlight from "./interactionHighlight";
import useSpring from "shared/ui/hook/useSpring";
import clientSignals from "shared/signal/clientSignals";
import { lerp } from "@rbxts/pretty-react-hooks";
import CurrentCamera from "shared/util/CurrentCamera";
import OnKeyClicked from "shared/util/OnKeyClicked";
import { Mocha } from "@rbxts/catppuccin";
import interactionData, { defaultIcon } from "shared/data/interactionData";
import Center from "../../base/Center";
import Padding from "../../base/Padding";
import Text from "../../base/Text";

const getFocusedInteraction = (): BasePart | undefined => {
	const raycastParams = new RaycastParams();
	raycastParams.IgnoreWater = false;
	raycastParams.FilterDescendantsInstances = [CurrentCamera];
	raycastParams.FilterType = Enum.RaycastFilterType.Exclude;

	const raycastResult = Workspace.Raycast(
		CurrentCamera.CFrame.Position,
		CurrentCamera.CFrame.LookVector.mul(100),
		raycastParams,
	);

	if (!raycastResult) return;

	if (raycastResult.Instance.HasTag("interaction")) return raycastResult.Instance as BasePart;
};

export default (props: CommonProps) => {
	const [interactionMode, setInteractionMode] = Roact.useState(false);
	const [lastInteractingWith, setLastInteractingWith] = Roact.useBinding(undefined) as LuaTuple<
		[Roact.Binding<BasePart | undefined>, (newValue: BasePart | undefined) => void]
	>;
	const [interactingWith, setInteractingWith] = Roact.useState(undefined) as LuaTuple<
		[BasePart | undefined, Roact.Dispatch<Roact.SetStateAction<BasePart | undefined>>]
	>;
	const [lastRenderedSubInteractions, setLastRenderedSubInteractions] = Roact.useState([]) as unknown as LuaTuple<
		[Roact.Element[], Roact.Dispatch<Roact.SetStateAction<Roact.Element[]>>]
	>;

	const [shownFactor, setShownFactor] = useSpring({ initialValue: 0, stiffness: 70, dampening: 20 });
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
		const subInteractionsData = interactionData[interactingWith.GetAttribute("interactionType") as string];

		subInteractionsData.forEach((subInteraction) => {
			newRenderedSubInteractions.push(
				<textbutton
					Size={UDim2.fromScale(1, 1)}
					Text=""
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundColor3={Mocha.Base}
					Event={{
						MouseButton1Click: () => {
							subInteraction.functionality(interactingWith);
							setInteractionMode(false);
						},
					}}
				>
					<uicorner CornerRadius={new UDim(0.25, 0)} />
					<Padding Size={15} />
					<Center FillDirection={Enum.FillDirection.Horizontal} Padding={new UDim(0.05, 0)} />

					<imagelabel
						Size={UDim2.fromScale(1, 1)}
						BackgroundTransparency={1}
						ImageColor3={Mocha.Text}
						Image={subInteraction.icon !== undefined ? subInteraction.icon : defaultIcon}
						ScaleType={Enum.ScaleType.Crop}
					>
						<uiaspectratioconstraint AspectRatio={1 / 1} />
					</imagelabel>

					<Text
						Text={subInteraction.name}
						Size={UDim2.fromScale(0.8, 1)}
						TextSize={35}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextColor3={Mocha.Text}
						AutomaticSize={Enum.AutomaticSize.X}
					/>
				</textbutton>,
			);
		});

		setLastRenderedSubInteractions(newRenderedSubInteractions);
	}

	setLastInteractingWith(interactingWith);

	Roact.useEffect(() => {
		const maid = new Maid();
		const highlights: Highlight[] = [];

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
			if (!interaction.IsA("BasePart"))
				error(
					`${interaction.Name} has an incorrect type to be an interaction, accepted type is BasePart, got ${interaction.ClassName}`,
				);

			if (interaction.GetAttribute("interactionType") === undefined)
				error(`${interaction.Name} lacks the interactionType attribute!`);

			const highlight = interactionHighlight();
			highlight.Parent = interaction;
			highlights.push(highlight);
			maid.GiveTask(highlight);
		});

		maid.GiveTask(
			clientSignals.onRender.Connect((deltaTime: number) => {
				highlights.forEach((highlight: Highlight) => {
					highlight.FillTransparency = lerp(1, 0.25, shownFactor.getValue());
					highlight.OutlineTransparency = lerp(1, 0.25, shownFactor.getValue());
				});

				if (interactingWith) {
					const currentlyFocusedInteraction = getFocusedInteraction();
					if (currentlyFocusedInteraction !== interactingWith) {
						setInteractingWith(undefined);
					}
				}
			}),
		);

		return () => {
			maid.DoCleaning();
		};
	});

	return (
		<Fragment>
			<imagelabel
				Image={"rbxassetid://13321848320"}
				Size={UDim2.fromScale(0.1, 0.1)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				ImageColor3={Mocha.Text}
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
				Position={interactingWithFactor.map((factor: number) => {
					return UDim2.fromScale(0.62, 0.5).Lerp(UDim2.fromScale(0.63, 0.5), factor);
				})}
			>
				<Center />
				<frame Size={UDim2.fromScale(0.2, 0.075)} BackgroundTransparency={1}>
					<uilistlayout Padding={new UDim(0.1, 0)} />
					{...lastRenderedSubInteractions}
				</frame>
			</canvasgroup>
		</Fragment>
	);
};
