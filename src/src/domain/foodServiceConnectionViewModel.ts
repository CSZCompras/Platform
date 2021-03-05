import { FoodService } from "./foodService";

export class FoodServiceConnectionViewModel{

    foodService         : FoodService;
    priceListId         : string;
    paymentTerm         : number;
    reasonToRejectId    : string; 
    priceListName       : string;
    status              : number;
    isApproving         : boolean;
    isRejecting         : boolean;
}