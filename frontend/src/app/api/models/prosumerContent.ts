import { houseContent, houseContentWithoutPowerPlant } from "./houseContent";

export const prosumerContent = `prosumer {currency isBlocked ${houseContent}}`;
export const prosumerQuery = `query prosumer {${prosumerContent}}`;
export const prosumerContentById = `prosumer (id: $id) { currency isBlocked ${houseContentWithoutPowerPlant}}`
export const prosumerQueryById = `query prosumerById ($id: ID!) {${prosumerContentById}}`