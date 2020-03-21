import { ProductViewModel } from "./productViewModel";
import { SupplierViewModel } from "./supplierViewModel";
import { ProductClass } from "./productClass";

export class CotacaoViewModel{

    id                      : string;
    buyListName             : string;
    productClass            : ProductClass;
    products                : ProductViewModel[];
    suppliers               : SupplierViewModel[];
    blackListSupplier       : SupplierViewModel;
    observation             : string;
}