import { UnitOfMeasurement } from './unitOfMeasurement';
import { ProductCategory } from './productCategory';
import { FoodServiceProduct } from './foodServiceProduct';
import { Brand } from './brand';

export class Product{
    id          : string;
    name        : string;
    description : string;
    brand       : Brand;
    category    : ProductCategory;
    unit        : UnitOfMeasurement;
    isActive    : boolean;  
}