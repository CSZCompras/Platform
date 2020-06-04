import { SimulationInputItem } from "./simulationInputItem";
import { SupplierViewModel } from "../supplierViewModel";
import { MarketViewModel } from "../marketViewModel";
import { MarketInputViewModel } from "./marketInputViewModel";

export class SimulationInput
{ 
    buyListId           : string;
    buyListName         : string;
    markets             : MarketInputViewModel[];
    
    constructor() { 
        this.markets = [];     
    }
}