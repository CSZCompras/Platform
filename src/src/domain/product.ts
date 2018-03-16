import { UnitOfMeasurement } from './unitOfMeasurement';
import { ProductCategory } from './productCategory';
import { FoodServiceProduct } from './foodServiceProduct';

export class Product{
    id : string;
    name : string;
    description ; string;
    category : ProductCategory;
    unit : UnitOfMeasurement;
    isActive : boolean; 
    foodServiceProducts : FoodServiceProduct[];
}