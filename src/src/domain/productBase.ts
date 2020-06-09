import { ProductCategory } from "./productCategory";
import { Product } from "./product";

export class ProductBase{
    
    constructor() {
        this.products = [];
    }
    
    id          : string;
    name        : string;
    category    : ProductCategory;
    isActive    : boolean;  
    products    : Product[];    
}