import { FoodService } from "./foodService";

export class FoodServiceConnectionViewModel{

    foodService         : FoodService;
    priceListId         : string;
    reasonToRejectId    : string;
    priceListName       : string;
    status              : number;
}