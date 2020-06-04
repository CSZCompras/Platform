import { SimulationResultItem } from "./simulationResultItem";
import { SimulationSummaryItem } from "./simulationSummaryItem";
import { ProductClass } from "../productClass";

export class SimulationResult{

    id                      : string;
    market                  : ProductClass;
    items                   : SimulationResultItem[];
    summaryItems            : SimulationSummaryItem[];
    isValid                 : boolean;
    total                   : number;
    logMessages             : string;
    validationMessages      : string;
    isSelected              : boolean;
    deliveryScheduleStart   : Number;
    deliveryScheduleEnd     : Number;
    deliveryDate            : Date;
	observation             : string;
}