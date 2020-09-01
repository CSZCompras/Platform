import { SimulationInputItem } from "./simulationInputItem";
import { SupplierViewModel } from "../supplierViewModel"; 
import { CheckDeliveryViewModel } from "../checkDeliveryViewModel";
import { CheckDeliveryResult } from "../checkDeliveryResult";
import { DeliveryRule } from "../deliveryRule";
import { SimulationInputBaseItem } from "./simulationInputBaseItem";

export class SimulationMarketInputViewModel{
    
    
    constructor() {  

        this.items = [];  
        this.suppliers = [];
        this.supplierBlackList = [];
    }

    id                          : string;
    name                        : string;
    filter                      : string;
    suppliers                   : SupplierViewModel[];
    items                       : SimulationInputBaseItem[];
    filteredItems               : SimulationInputBaseItem[];
    supplierBlackList           : SupplierViewModel[];
    deliveryRule                : DeliveryRule;
    checkDeliveryViewModel 		: CheckDeliveryViewModel;
    checkDeliveryResult			: CheckDeliveryResult;
    isValid                     : boolean;
}