import { FoodService } from "./foodService";
import { User } from "./user";
import { SimulationResult } from "./simulationResult";
import { SupplierOrder } from "./supplierOrder";

export class Order{

    id              : string;
    foodService     : FoodService;
    createdBy       : User;
    createdOn       : Date;
    simulation      : SimulationResult;
    supplierOrders  : SupplierOrder[];
    status          : number;
    total           : number;
    code            : number;
}