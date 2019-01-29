import { SimulationResultItem } from "./simulationResultItem";
import { SimulationSummaryItem } from "./simulationSummaryItem";

export class SimulationResult{

    id                      : string;
    items                   : SimulationResultItem[];
    simulationSummaryItem   : SimulationSummaryItem[];
    isValid                 : boolean;
    total                   : number;
    logMessages             : string;
    ValidationMessages      : string;
    isSelected              : boolean;
}