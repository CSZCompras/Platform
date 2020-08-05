import { SupplierStatus } from "../supplierStatus";

export class SupplierOrdersOverview{ 

    name                : string;
    createdOn           : Date;
    numberOfOrders      : number;
    lastOrderDate       : Date;
    status              : SupplierStatus;
    firstOrderDate      : Date;
    totalOrders         : number;
    qtdeProdutos        : number;
}