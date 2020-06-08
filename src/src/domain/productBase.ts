import { ProductCategory } from "./productCategory";

export class ProductBase{
    
    id          : string;
    name        : string;
    category    : ProductCategory;
    isActive    : boolean;  
}