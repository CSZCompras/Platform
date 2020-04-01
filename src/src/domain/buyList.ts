import { FoodService } from "./foodService";
import { FoodServiceProduct } from "./foodServiceProduct";
import { BuyListProduct } from "./buyListProduct";
import { BuyListStatus } from "./buyListStatus";
import { ProductClass } from "./productClass";

export class BuyList{
    
    id              : string;
    name            : string;
    status          : BuyListStatus;
    foodService     : FoodService;
    products        : BuyListProduct[];
    productClass    : ProductClass;
    isDefaultList   : boolean;
}