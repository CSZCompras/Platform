import { Supplier } from "./supplier";
import { FoodService } from "./foodService";

export class FoodServiceSupplier{

    supplier        : Supplier[];
    supplierId      : string;
    foodService     : FoodService;
    foodServiceId   : string;
    status          : number;
}