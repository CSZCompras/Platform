import { SimulationInputItem } from "./simulationInputItem";
import { SupplierViewModel } from "./supplierViewModel";

export class SimulationInput{
    
	
    buyListId           : string;
    items               : SimulationInputItem[];
    supplierBlackList   : SupplierViewModel[];

    
    constructor() {
    
        this.items = [];        
    }
}