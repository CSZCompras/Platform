import { SupplierViewModel } from "./supplierViewModel";
import { FoodServiceViewModel} from "./foodServiceViewModel"

export class ProductAssociationViewModel{

    constructor() {
        this.suppliers = [];
        this.foodServices = [];
    }
    
    productBaseId               : string;
    productId                   : string;
    name                        : string;
    description                 : string;
    unit                        : string;
    unitInternal                : string;
    multiplier                  : Number;
    priceIsByUnitPrincipal      : boolean;
    isActive                    : boolean;
    gtin                        : string;
    suppliers                   : SupplierViewModel[];
    foodServices                : FoodServiceViewModel[];
}