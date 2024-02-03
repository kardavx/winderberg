import Maid from "@rbxts/maid";
import { Lighting } from "@rbxts/services";
import serverSignals from "shared/signal/serverSignals";
import lerpNumber from "shared/util/lerpNumber";

const dayAmbient = Color3.fromHex("d6d6d6");
const dayOutdoorAmbient = Color3.fromHex("89b4b9");
const dayBrightness = 3;

const nightAmbient = Color3.fromHex("000000");
const nightOutdoorAmbient = Color3.fromHex("141616");
const nightBrightness = 0;

const dayStartHour = 7;
const nightStartHour = 21;

const dayInGameLength = nightStartHour - dayStartHour;
const nightInGameLength = 24 - dayInGameLength;

// w minutach
const dayRealLength = 50;
const nightRealLength = 20;

const dayTimeIncreaseEveryMinute = (60 * dayInGameLength) / dayRealLength;
const nightTimeIncreaseEveryMinute = (60 * nightInGameLength) / nightRealLength;

const lightingPropertiesFadeAlpha = 0.1;
const updateIntervalMultiplier = 10;

export const isDay = (): boolean => {
	if (Lighting.ClockTime >= dayStartHour && Lighting.ClockTime < nightStartHour) {
		return true;
	}

	return false;
};

const dayCycle: InitializerFunction = () => {
	const maid = new Maid();

	Lighting.ClockTime = dayStartHour;
	Lighting.Ambient = dayAmbient;
	Lighting.Brightness = dayBrightness;
	Lighting.OutdoorAmbient = dayOutdoorAmbient;

	maid.GiveTask(() => {
		Lighting.ClockTime = dayStartHour;
		Lighting.Ambient = dayAmbient;
		Lighting.Brightness = dayBrightness;
		Lighting.OutdoorAmbient = dayOutdoorAmbient;
	});

	let nextUpdateTick = tick() + 60 / updateIntervalMultiplier;
	let targetClockTime = Lighting.ClockTime;

	maid.GiveTask(
		serverSignals.onUpdate.Connect((deltaTime: number) => {
			if (tick() >= nextUpdateTick) {
				nextUpdateTick = tick() + 60 / updateIntervalMultiplier;

				if (isDay()) {
					targetClockTime = targetClockTime + dayTimeIncreaseEveryMinute / 60 / updateIntervalMultiplier;
				} else {
					targetClockTime = targetClockTime + nightTimeIncreaseEveryMinute / 60 / updateIntervalMultiplier;
				}
			}

			Lighting.ClockTime = lerpNumber(
				Lighting.ClockTime,
				targetClockTime,
				lightingPropertiesFadeAlpha * deltaTime,
			);

			if (isDay()) {
				Lighting.Ambient = Lighting.Ambient.Lerp(dayAmbient, lightingPropertiesFadeAlpha * deltaTime);
				Lighting.OutdoorAmbient = Lighting.Ambient.Lerp(
					dayOutdoorAmbient,
					lightingPropertiesFadeAlpha * deltaTime,
				);
				Lighting.Brightness = lerpNumber(
					Lighting.Brightness,
					dayBrightness,
					lightingPropertiesFadeAlpha * deltaTime,
				);
			} else {
				Lighting.Ambient = Lighting.Ambient.Lerp(nightAmbient, lightingPropertiesFadeAlpha * deltaTime);
				Lighting.OutdoorAmbient = Lighting.Ambient.Lerp(
					nightOutdoorAmbient,
					lightingPropertiesFadeAlpha * deltaTime,
				);
				Lighting.Brightness = lerpNumber(
					Lighting.Brightness,
					nightBrightness,
					lightingPropertiesFadeAlpha * deltaTime,
				);
			}
		}),
	);

	return () => maid.DoCleaning();
};

export default dayCycle;
