import { kWh_to_Ws } from "../math/electricity";
import { bilinearInterpolation } from "../math/interpolation";

// Base unit for electricity is in Ws (Watt-seconds)

export const AVERAGE_POWERPLANT_COAL_GENERATOR_ELECTRICITY_PRODUCTION_PER_SECOND = kWh_to_Ws(110.908307349); 
// Source: https://www.mcginley.co.uk/news/how-much-of-each-energy-source-does-it-take-to-power-your-home/bp254/
// Motivation: 3 500 000 000 kWh per year => 3 500 000 000 / (365.25 * 24 * 3 600) = 110.908307349 kWh per second.

export const AVERAGE_HOUSE_ELECTRICITY_CONSUMPTION_PER_SECOND = kWh_to_Ws(0.00063376175);
// Source: https://www.energimarknadsbyran.se/el/dina-avtal-och-kostnader/elkostnader/elforbrukning/normal-elforbrukning-och-elkostnad-for-villa/
// Motivation: 20 000 kWh per year => 20 000 / (365.25 * 24 * 3 600) = 0.00063376175 kWh per second.

export const AVERAGE_HOUSE_WIND_TURBINE_PRODUCTION_PER_SECOND = 1500;
// Source: https://www.windforce.se/vindkraftverk.php
// Motivation: Assumption of average consumer owned wind turbine providing an effect around 1500 W based on wind turbines listed on site.

export const AVERAGE_HOUSE_BATTERY_CAPACITY = AVERAGE_HOUSE_ELECTRICITY_CONSUMPTION_PER_SECOND * (3600 * 24 * 7);
// Motivation: Assmption that a fully charged battery should last a week with an average consumption.
