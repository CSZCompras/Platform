import { SimulationInputItem } from "./simulationInputItem";

export class SimulationInput{
    
    buyListId           : string;

    items               : SimulationInputItem[];

    
    constructor() {
    
        this.items = [];        
    }
}