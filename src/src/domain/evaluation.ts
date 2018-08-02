import { Supplier } from "./supplier";
import { FoodService } from "./foodService";
import { Order } from "./order";
import { User } from "./user";
import { EvaluationStatus } from "./evaluationStatus";

export class Evaluation{

    id              : string;
    supplier        : Supplier;
    foodService     : FoodService;
    order           : Order;
    rating          : number;
    createdOn       : Date;
    user            : User;
    status          : EvaluationStatus;
    comment         : string;    
}