import { SimulationInputItem } from "./simulationInputItem";
import { SupplierViewModel } from "../supplierViewModel";
import { BrandViewModel } from "../brandViewModel";
import { UnitViewModel } from "../unitViewModel";

export class SimulationInputBaseItem{ 

    constructor() {
        this.suppliersBlackList     = [];
        this.brandsBlackList        = [];
        this.productsBlackList      = []; 
    }

    productBaseId               : string;
    quantity                    : number;
    name                        : string;
    category                    : string;
    items                       : SimulationInputItem[];
    brands                      : BrandViewModel[];
    units                       : UnitViewModel[];
    suppliers                   : SupplierViewModel[]; 

    
    suppliersBlackList          : SupplierViewModel[];
    brandsBlackList             : BrandViewModel[];
    productsBlackList           : SimulationInputItem[];
}