import CurrentCamera from "shared/util/CurrentCamera";

const calculateSize = (pxSize: number) => {
	return (pxSize * CurrentCamera.ViewportSize.X) / 1920;
};

export default (pxSize: number): number => {
	return calculateSize(pxSize);
};
