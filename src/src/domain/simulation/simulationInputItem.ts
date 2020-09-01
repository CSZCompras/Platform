import { SupplierViewModel } from "../supplierViewModel";
import { UnitViewModel } from "../unitViewModel";
import { BrandViewModel } from "../brandViewModel";

export class SimulationInputItem{

    constructor() { 
    }
    
    
    foodServiceProductId    : string;
    productId               : string;
    description             : string;
    umDetailed              : string;
    unit                    : UnitViewModel;
    unitInternal            : UnitViewModel;
    brand                   : BrandViewModel;
    hasSuppliers            : boolean;
}