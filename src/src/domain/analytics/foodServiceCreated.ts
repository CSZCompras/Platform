import { FoodServiceStatus } from "../foodServiceStatus";

export class FoodServiceCreated{

    name                : string;
    createdOn           : Date;
    numberOfOrders      : number;
    lastOrderDate       : Date;
    status              : FoodServiceStatus;
}