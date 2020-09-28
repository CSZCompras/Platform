import { Supplier } from "./supplier";
import { FoodService } from "./foodService";
import { PriceList } from "./priceList";
import {ReasonToRejectFoodService} from './reasonToRejectFoodService';

export class FoodServiceSupplier{

    supplier            : Supplier[];
    supplierId          : string;
    foodService         : FoodService;
    foodServiceId       : string;
    priceList           : PriceList;
    priceListId         : string;
    status              : number;
    paymentTerm         : number;
    reasonToReject      : ReasonToRejectFoodService;
    reasonToRejectId    : string;
}