import { Product } from "./product";
import { FoodService } from "./foodService";

export class FoodServiceProduct{

    product         : Product;
    productId       : string;
    foodService     : FoodService;
    foodServiceId   : string;
    isActive        : boolean;
}