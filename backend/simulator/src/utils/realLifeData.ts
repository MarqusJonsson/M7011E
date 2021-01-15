import { kWh_to_Ws } from '../math/electricity';

// Base unit for electricity is in Ws (Watt-seconds)

export const AVERAGE_HOUSE_ELECTRICITY_CONSUMPTION_PER_SECOND = kWh_to_Ws(0.00063376175);
// Source: https://www.energimarknadsbyran.se/el/dina-avtal-och-kostnader/elkostnader/elforbrukning/normal-elforbrukning-och-elkostnad-for-villa/
// Motivation: 20000 kWh per year => 20 000 / (365.25 * 24 * 3600) = 0.00063376175 kWh per second.

export const AVERAGE_HOUSE_WIND_TURBINE_PRODUCTION_PER_SECOND = 1500 * 4;
// Source: https://www.windforce.se/vindkraftverk.php
// Motivation: Assumption of average consumer owned wind turbine providing an effect around 1500 W based on wind turbines listed on site.
// However this would lead to a very small chance of exessive production, thus we increased this value quite a bit

export const AVERAGE_HOUSE_BATTERY_CAPACITY = AVERAGE_HOUSE_ELECTRICITY_CONSUMPTION_PER_SECOND * (3600 * 24 * 7);
// Motivation: Assumption that a fully charged battery should last a week with an average consumption.

export const ELECTRICITY_SELL_RATIO = 0.67;
// Source:	https://www.vattenfall.se/solceller/solcellspaket/mikroproduktion-salj-solel/
//			https://www.vattenfall.se/elavtal/elpriser/timpris-pa-elborsen/

export const electricityPricePerWattSecond = (averageDemand: number, deltaTimeS: number) => {
	if (deltaTimeS === 0) return averageDemand * 0.00000000017 + 0.5 / 3600000;
	return averageDemand / deltaTimeS * 0.00000000017 + 0.5 / 3600000;
}
// Source: https://www.statista.com/statistics/418124/electricity-prices-for-households-in-sweden/
// Motivation: Made up function to model the electricity price to stay close to 1.8 currency units when expected average demand is met

export const MONTH_AVERAGE_TEMPERATURES = [-11.6, -11.5, -6.4, -0.5, 5.9, 12.6, 15.2, 13,9, 8.7, 2.8, -3.5, -8.3];
// Source: https://sv.climate-data.org/europa/sverige/norrbottens-laen/lulea-496/


export const AVERAGE_COAL_POWER_PLANT_ELECTRICITY_PRODUCTION_PER_SECOND = kWh_to_Ws(110.908307349 / 1000); 
// Source: https://www.mcginley.co.uk/news/how-much-of-each-energy-source-does-it-take-to-power-your-home/bp254/
// Source gives: 3500000000 kWh per year => 3500000000 / (365.25 * 24 * 3600) = 110.908307349 kWh per second.
// But this is likely for more households than we are planning to simulate, so we lower this significantly

export const AVERAGE_COAL_POWER_PLANT_ELECTRICITY_CONSUMPTION_PER_SECOND = kWh_to_Ws(0.00190128525);
// This consumption is not based on any real life data
