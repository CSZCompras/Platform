import { FoodServiceStatus } from "../foodServiceStatus";

export class FoodServiceOrdersOverview{

    name                : string;
    createdOn           : Date;
    numberOfOrders      : number;
    lastOrderDate       : Date;
    status              : FoodServiceStatus;
    firstOrderDate      : Date;
    totalOrders         : number;
    qtdeProdutos        : number;
}