import { SimulationInputItem } from "./simulationInputItem";
import { SupplierViewModel } from "../supplierViewModel";
import { MarketViewModel } from "../marketViewModel";
import { SimulationMarketInputViewModel } from "./simulationMarketInputViewModel";

export class SimulationInput
{ 
    buyListId           : string;
    buyListName         : string;
    markets             : MarketInputViewModel[];
    
    constructor() { 
        this.markets = [];     
    }
}