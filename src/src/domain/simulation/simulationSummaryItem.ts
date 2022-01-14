import { Supplier } from "../supplier";
import { MarketRule } from "../marketRule";
import { SimulationResultItem } from "./simulationResultItem";

export class SimulationSummaryItem {

    id: string;
    supplier: Supplier;
    rule: MarketRule;
    items: SimulationResultItem[];
    paymentTerm: number;
    products: string;
    total: number;
    observation: string;
}