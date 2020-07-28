import { SupplierStatus } from "../supplierStatus";

export class SupplierCreated{ 

    name                : string;
    createdOn           : Date;
    numberOfOrders      : number;
    lastOrderDate       : Date;
    status              : SupplierStatus;
}