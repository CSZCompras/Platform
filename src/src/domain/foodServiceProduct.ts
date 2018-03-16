import { Product } from "./product";
import { FoodService } from "./foodService";

export class FoodServiceProduct{

    isActive: boolean;
    product : Product;
    productId : string;

    foodService : FoodService;
    foodServiceId : string;
}