import { UnitOfMeasurement } from './unitOfMeasurement';
import { ProductCategory } from './productCategory';
import { FoodServiceProduct } from './foodServiceProduct';
import { Brand } from './brand';
import { ProductBase } from './productBase';

export class Product{

    constructor() {
        this.unit = new UnitOfMeasurement();
    }

    id              : string; 
    description     : string;
    base            : ProductBase;
    brand           : Brand; 
    unit            : UnitOfMeasurement;
    unitInternal    : UnitOfMeasurement;
    multiplier      : Number;
    isActive        : boolean;  
    gtin            : string;
}