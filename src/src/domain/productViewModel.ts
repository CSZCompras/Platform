import { SupplierViewModel } from "./supplierViewModel";

export class ProductViewModel{

    id              : string;
    name            : string;
    description     : string;
    brand           : string;
    category        : string;
    unitOfMeasure   : string;
    suppliers       : SupplierViewModel[];
    quantity        : number;
}