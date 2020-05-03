import { SimulationInputItem } from "./simulationInputItem";
import { SupplierViewModel } from "./supplierViewModel";
import { MarketViewModel } from "./marketViewModel";

export class MarketInputViewModel{
    
    
    constructor() {  
        this.items = [];  
        this.supplierBlackList = [];
    }
    
    market              : MarketViewModel;
    items               : SimulationInputItem[];
    supplierBlackList   : SupplierViewModel[];
}