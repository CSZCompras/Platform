import { SimulationInputItem } from "./simulationInputItem";
import { SupplierViewModel } from "../supplierViewModel";
import { MarketViewModel } from "../marketViewModel";
import { CheckDeliveryViewModel } from "../checkDeliveryViewModel";

export class MarketInputViewModel{
    
    
    constructor() {  
        this.items = [];  
        this.supplierBlackList = [];
    }
    
    market                      : MarketViewModel;
    items                       : SimulationInputItem[];
    supplierBlackList           : SupplierViewModel[];
    viewModel 					: CheckDeliveryViewModel;
}