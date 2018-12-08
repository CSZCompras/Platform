import { Brand } from './brand';
import { Product } from './product';
import { Supplier } from './supplier';


export class SupplierProduct{
    id : string;
    supplier : Supplier;
    product : Product;
    price : number;
    isActive : boolean;
}