export interface CharacterLook {
	face: number;
	hair: number;
	facialHair: number;
	skinColor: number;
}

export interface CharacterOutfit {
	shirt: number;
	pants: number;
	belt: number;
	hat: number;
	mask: number;
	accessory: number;
}

export type Field = keyof CharacterLook | keyof CharacterOutfit;

export const optionalElements: Field[] = ["facialHair", "hair", "belt", "hat", "mask", "accessory"];

export const getDefaultValue = (field: Field) => (optionalElements.includes(field) ? 0 : 1);

export const defaultCharacterLook: CharacterLook = {
	face: getDefaultValue("face"),
	hair: getDefaultValue("hair"),
	facialHair: getDefaultValue("facialHair"),
	skinColor: getDefaultValue("skinColor"),
};

export const defualtCharacterOutfit: CharacterOutfit = {
	shirt: getDefaultValue("shirt"),
	pants: getDefaultValue("pants"),
	belt: getDefaultValue("belt"),
	hat: getDefaultValue("hat"),
	mask: getDefaultValue("mask"),
	accessory: getDefaultValue("accessory"),
};
