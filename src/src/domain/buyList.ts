import { FoodService } from "./foodService";
import { FoodServiceProduct } from "./foodServiceProduct";
import { BuyListProduct } from "./buyListProduct";

export class BuyList{
    
    id : string;
    name : string;
    foodService : FoodService;
    products : BuyListProduct[];
}