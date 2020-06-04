import { SupplierViewModel } from "../supplierViewModel";

export class SimulationInputItem{

    constructor() {
        this.suppliers = [];
    }

    productId               : string;
    quantity                : number;
    description             : string;
    name                    : string;
    unitOfMeasure           : string;
    category                : string;
    brand                   : string;

    suppliers               : SupplierViewModel[];
}