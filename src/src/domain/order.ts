import { FoodService } from "./foodService";
import { User } from "./user";
import { SimulationResult } from "./simulationResult"; 
import { OrderItem } from "./orderItem";

export class Order{

    id              : string;
    foodService     : FoodService;
    createdBy       : User;
    createdOn       : Date;
    simulation      : SimulationResult; 
    status          : number;
    total           : number;
    code            : number;        
    items           : OrderItem[];
    deliveryDate    : Date;
    paymentDate     : Date;
}