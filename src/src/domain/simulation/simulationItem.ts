import { Product } from "../product";
import { Supplier } from "../supplier";
import { SupplierProduct } from "../supplierProduct";

export class SimulationItem{

    id                  : string;
    product             : Product;
    supplier            : Supplier;    
    SupplierProduct     : SupplierProduct;
    quantity            : number;    
}