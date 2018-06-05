import { Supplier } from "./supplier";
import { FoodService } from "./foodService";
import { OrderItem } from "./orderItem";
import { User } from "./user";

export class SupplierOrder{

    id              : string;
    supplier        : Supplier;
    foodService     : FoodService;
    total           : number;
    items           : OrderItem[];
    status          : number;
    code            : number;
    createdBy       : User;
    createdOn       : Date;
}