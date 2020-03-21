import { ProductCategory } from "./productCategory";

export class ProductClass{

    id                  : string;
    name                : string; 
    isActive            : boolean;
    categories          : ProductCategory[];
}