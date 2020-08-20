import { SimulationMarketInputViewModel } from "./simulationMarketInputViewModel";

export class SimulationInput
{ 
    buyListId           : string;
    buyListName         : string;
    markets             : SimulationMarketInputViewModel[];
    
    constructor() { 
        this.markets = [];     
    }
}