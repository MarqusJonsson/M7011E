export const setHouseOverproductionRatioMutation = `mutation setOverproductionRatio ($ratio: Float!) {
	setOverproductionRatio (overproductionRatio: $ratio) {
		overproductionRatio
	}
}`

export const setHouseUnderproductionRatioMutation = `mutation setUnderproductionRatio ($ratio: Float!) {
	setUnderproductionRatio (underproductionRatio: $ratio) {
		underproductionRatio
	}
}`