import { SupplierProduct } from './supplierProduct';

export class SupplierProductFileRow {

    id : string;
    supplierProduct : SupplierProduct;
    message : string;
    exception : string;
    status : number;
    oldPrice : number;
    newPrice : number;
    lineContent : string;
    lineNumber : number;
}