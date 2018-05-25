import { SimulationResultItem } from "./simulationResultItem";

export class SimulationResult{

    id                      : string;
    items                   : SimulationResultItem[];
    isValid                 : boolean;
    total                   : number;
    logMessages             : string;
    ValidationMessages      : string;
}