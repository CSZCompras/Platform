import { Order } from "./order";
import { Supplier } from "./supplier";
import { InvoiceStatus } from "./invoiceStatus";

export class Invoice{

    id                  : string;
    dateReference       : Date;
    maturity            : Date;
    orders              : Order[];
    supplier            : Supplier;
    totalValue          : number;
    fee                 : number;
    valueToPay          : number;
    status              : InvoiceStatus;

}