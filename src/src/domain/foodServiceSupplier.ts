import { Supplier } from "./supplier";
import { FoodService } from "./foodService";
import { PriceList } from "./priceList";

export class FoodServiceSupplier{

    supplier        : Supplier[];
    supplierId      : string;
    foodService     : FoodService;
    foodServiceId   : string;
    priceList       : PriceList;
    priceListId     : string;
    status          : number;
}