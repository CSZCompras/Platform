import { SimulationInputItem } from "./simulationInputItem";
import { SupplierViewModel } from "../supplierViewModel"; 
import { CheckDeliveryViewModel } from "../checkDeliveryViewModel";
import { CheckDeliveryResult } from "../checkDeliveryResult";
import { DeliveryRule } from "../deliveryRule";

export class MarketInputViewModel{
    
    
    constructor() {  

        this.items = [];  
        this.suppliers = [];
        this.supplierBlackList = [];
    }

    id                          : string;
    name                        : string;
    suppliers                   : SupplierViewModel[];
    items                       : SimulationInputItem[];
    supplierBlackList           : SupplierViewModel[];
    deliveryRule                : DeliveryRule;
    checkDeliveryViewModel 		: CheckDeliveryViewModel;
    checkDeliveryResult			: CheckDeliveryResult;
    isValid                     : boolean;
}