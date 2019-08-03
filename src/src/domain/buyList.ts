import { FoodService } from "./foodService";
import { FoodServiceProduct } from "./foodServiceProduct";
import { BuyListProduct } from "./buyListProduct";
import { BuyListStatus } from "./buyListStatus";

export class BuyList{
    
    id          : string;
    name        : string;
    status      : BuyListStatus;
    foodService : FoodService;
    products    : BuyListProduct[];
}