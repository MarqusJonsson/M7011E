export const updateElectricityPrices = `mutation updateElectricityPrices ($electricityBuyPrice: Float!, $electricitySellPrice: Float!) {
	updateElectricityPrices(electricityBuyPrice: $electricityBuyPrice, electricitySellPrice: $electricitySellPrice) {
		electricityBuyPrice
		electricitySellPrice
	}
}`;
