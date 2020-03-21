import { SimulationResultItem } from "./simulationResultItem";
import { SimulationSummaryItem } from "./simulationSummaryItem";

export class SimulationResult{

    id                      : string;
    items                   : SimulationResultItem[];
    summaryItems            : SimulationSummaryItem[];
    isValid                 : boolean;
    total                   : number;
    logMessages             : string;
    ValidationMessages      : string;
    isSelected              : boolean;
    deliveryScheduleStart   : Number;
    deliveryScheduleEnd     : Number;
    deliveryDate            : Date;
	observation             : string;
}