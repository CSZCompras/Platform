import { Supplier } from "./supplier";
import { MarketRule } from "./marketRule";

export class SimulationSummaryItem{

    id                  : string;
    supplier            : Supplier;
    rule                : MarketRule;
    products            : string;
    total               : number;
	observation         : string;
}