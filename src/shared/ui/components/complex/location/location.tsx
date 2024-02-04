import { CommonProps } from "shared/types/UITypes";
import Text from "../../base/Text";
import Roact from "@rbxts/roact";
import CurrentCamera from "shared/util/CurrentCamera";
import Padding from "../../base/Padding";
import { Workspace } from "@rbxts/services";

const getClosestTo = (to: Vector3, basePartList: BasePart[]): BasePart => {
	let closest: { distance: number; basePart: BasePart } | undefined = undefined;
	basePartList.forEach((basePart) => {
		const distance = to.sub(basePart.Position).Magnitude;
		if (!closest || distance < closest.distance) {
			closest = { distance, basePart };
		}
	});
	return (closest as unknown as { distance: number; basePart: BasePart }).basePart;
};

export default (props: CommonProps) => {
	const [street, setStreet] = Roact.useState("");
	const [postal, setPostal] = Roact.useState("");
	const [district, setDistrict] = Roact.useState("");

	Roact.useEffect(() => {
		const cameraPosition = CurrentCamera.CFrame.Position;
		const closestStreet = getClosestTo(
			cameraPosition,
			(Workspace as Workspace).ignore.Streets.GetChildren() as BasePart[],
		);

		const closestPostal = getClosestTo(
			cameraPosition,
			(Workspace as Workspace).ignore.Postals.GetChildren() as BasePart[],
		);

		const closestDistrict = getClosestTo(
			cameraPosition,
			(Workspace as Workspace).ignore.Districts.GetChildren() as BasePart[],
		);

		if (closestStreet.Name !== street) setStreet(closestStreet.Name);
		if (closestPostal.Name !== postal) setPostal(closestPostal.Name);
		if (closestDistrict.Name !== district) setDistrict(closestDistrict.Name);

		const conn = CurrentCamera.GetPropertyChangedSignal("CFrame").Connect(() => {
			const cameraPosition = CurrentCamera.CFrame.Position;

			const closestStreet = getClosestTo(
				cameraPosition,
				(Workspace as Workspace).ignore.Streets.GetChildren() as BasePart[],
			);

			const closestPostal = getClosestTo(
				cameraPosition,
				(Workspace as Workspace).ignore.Postals.GetChildren() as BasePart[],
			);

			const closestDistrict = getClosestTo(
				cameraPosition,
				(Workspace as Workspace).ignore.Districts.GetChildren() as BasePart[],
			);

			if (closestStreet.Name !== street) setStreet(closestStreet.Name);
			if (closestPostal.Name !== postal) setPostal(closestPostal.Name);
			if (closestDistrict.Name !== district) setDistrict(closestDistrict.Name);
		});

		return () => conn.Disconnect();
	});

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
			<Padding Size={20} />
			<Text
				AnchorPoint={new Vector2(1, 1)}
				Position={UDim2.fromScale(1, 1)}
				Size={UDim2.fromScale(0.5, 0.015)}
				Weight="Bold"
				TextXAlignment={Enum.TextXAlignment.Right}
				Text={`${district}, ${street} St. ${postal}`}
			/>
		</frame>
	);
};
