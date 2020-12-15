import { houseContent, houseContentWithoutPowerPlant } from "./houseContent";

export const prosumerContent = `prosumer {currency ${houseContent}}`;
export const prosumerQuery = `query prosumer {${prosumerContent}}`;
export const prosumerContentById = `prosumer (id: $id) {${houseContentWithoutPowerPlant}}`
export const prosumerQueryById = `query prosumerById ($id: ID!) {${prosumerContentById}}`