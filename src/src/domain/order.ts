import { FoodService } from "./foodService";
import { User } from "./user"; 
import { OrderItem } from "./orderItem";
import { OrderStatus } from "./orderStatus";

export class Order{

    id                  : string;
    foodService         : FoodService;
    createdBy           : User;
    createdOn           : Date; 
    status              : OrderStatus;
    total               : number;
    code                : number;        
    items               : OrderItem[];
    deliveryDate        : Date;
    paymentDate         : Date;
    reasonToReject      : string;
    deliveryScheduleStart : number;
    deliveryScheduleEnd : number;
}