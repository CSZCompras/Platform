import { Brand } from './brand';
import { Product } from './product';
import { Supplier } from './supplier';
import { SupplierProductStatus } from './SupplierProductStatus';


export class SupplierProduct{
    id          : string;
    supplier    : Supplier;
    product     : Product;
    price       : number;
    clientCode  : string;
    status      : SupplierProductStatus;
}