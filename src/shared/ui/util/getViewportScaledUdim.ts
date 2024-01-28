import CurrentCamera from "shared/util/CurrentCamera";

const calculateSize = (pxSize: number) => {
	return (pxSize * CurrentCamera.ViewportSize.X) / 1920;
};

export default (pxSize: number): UDim => {
	return new UDim(0, calculateSize(pxSize));
};
