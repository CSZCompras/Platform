import { Supplier } from "./supplier";
import { FoodService } from "./foodService";
import { OrderItem } from "./orderItem";
import { User } from "./user";
import { SupplierOrderStatus } from "./supplierOrderStatus";

export class SupplierOrder{

    id              : string;
    supplier        : Supplier;
    foodService     : FoodService;
    total           : number;
    items           : OrderItem[];
    status          : SupplierOrderStatus;
    code            : number;
    createdBy       : User;
    createdOn       : Date;
    deliveryDate    : Date;
    paymentDate     : Date;
}