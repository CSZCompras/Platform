import { FoodService } from "./foodService";
import { User } from "./user";
import { SimulationResult } from "./simulationResult"; 
import { OrderItem } from "./orderItem";
import { OrderStatus } from "./orderStatus";

export class Order{

    id                  : string;
    foodService         : FoodService;
    createdBy           : User;
    createdOn           : Date;
    simulation          : SimulationResult; 
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