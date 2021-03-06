import { SupplierProduct } from './supplierProduct';
import { Product } from './product';
import { Supplier } from './supplier';

export class PriceListItem{

    id                  : string;
    supplierProduct     : SupplierProduct;    
    price               : number;
}