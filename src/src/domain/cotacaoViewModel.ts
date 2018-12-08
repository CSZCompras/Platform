import { ProductViewModel } from "./productViewModel";
import { SupplierViewModel } from "./supplierViewModel";

export class CotacaoViewModel{

    id                      : string;
    buyListName             : string;
    products                : ProductViewModel[];
    suppliers               : SupplierViewModel[];
    blackListSupplier       : SupplierViewModel;
}