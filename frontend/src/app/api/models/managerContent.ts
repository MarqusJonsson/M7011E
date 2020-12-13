import { houseContent } from "./houseContent";
import { powerPlantContent } from "./powerPlantContent";

export const managerContent = `manager {currency ${powerPlantContent} prosumers {id house{battery {buffer capacity}}}}`;
export const managerQuery = `query manager {${managerContent}}`;