export const updateElectricityPrices = `mutation updateElectricityPrices ($electricityBuyPrice: Float!, $electricitySellPrice: Float!) {
	updateElectricityPrices(electricityBuyPrice: $electricityBuyPrice, electricitySellPrice: $electricitySellPrice) {
		electricityBuyPrice
		electricitySellPrice
	}
}`;

export const updateProductionOutputRatioMutation = `mutation updateProductionOutputRatio ($productionOutputRatio: Float!) {
	updateProductionOutputRatio(productionOutputRatio: $productionOutputRatio) {
		productionOutputRatio
	}
}`
