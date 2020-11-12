import { SupplierViewModel } from "../supplierViewModel";
import { UnitViewModel } from "../unitViewModel";
import { BrandViewModel } from "../brandViewModel";

export class SimulationInputItem{

    constructor() { 
        this.suppliers = [];
        this.suppliersBlackList = [];
    }
    
    
    foodServiceProductId    : string;
    productId               : string;
    description             : string;
    umDetailed              : string;
    suppliers               : SupplierViewModel[]; 
    suppliersBlackList      : SupplierViewModel[]; 
    unit                    : UnitViewModel;
    unitInternal            : UnitViewModel;
    brand                   : BrandViewModel;
    hasSuppliers            : boolean;
    noSuppliers             : boolean;
}