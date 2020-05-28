import { ProductViewModel } from "./productViewModel";
import { SupplierViewModel } from "./supplierViewModel";
import { ProductClass } from "./productClass";
import { CheckDeliveryViewModel } from "./checkDeliveryViewModel";
import { CheckDeliveryResult } from "./checkDeliveryResult";
import { DeliveryRule } from "./deliveryRule";

export class MarketViewModel
{ 
    constructor() {
      this.viewModel = new CheckDeliveryViewModel();    
      this.blackListSupplier = [];
      this.suppliers = [];
      this.products = [];
    }
    
    id                                : string;
    buyListName                       : string;
    productClass                      : ProductClass;
    products                          : ProductViewModel[];
    suppliers                         : SupplierViewModel[];
    blackListSupplier                 : SupplierViewModel[]; 
    viewModel 						            : CheckDeliveryViewModel;
    checkDeliveryResult				        : CheckDeliveryResult;
    deliveryRule					            : DeliveryRule;
    isValid                           : boolean;
}