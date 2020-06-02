import { Brand } from './brand';
import { Product } from './product';
import { Supplier } from './supplier';
import { SupplierProductStatus } from './supplierProductStatus';


export class SupplierProduct{
    id          : string;
    supplier    : Supplier;
    product     : Product;
    price       : number;
    clientCode  : string;
    status      : SupplierProductStatus;
}