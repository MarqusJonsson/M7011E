export const setHouseOverproductionRatioMutation = `mutation setOverproductionBatteryToPowerPlantRatio ($ratio: Float!) {
	setOverproductionBatteryToPowerPlantRatio (overproductionBatteryToPowerPlantRatio: $ratio) {
		overproductionBatteryToPowerPlantRatio
	}
}`

export const setHouseUnderproductionRatioMutation = `mutation setUnderproductionBatteryToPowerPlantRatio ($ratio: Float!) {
	setUnderproductionBatteryToPowerPlantRatio (underproductionBatteryToPowerPlantRatio: $ratio) {
		underproductionBatteryToPowerPlantRatio
	}
}`