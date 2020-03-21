import { Order } from "./order";
import { Supplier } from "./supplier";
import { InvoiceStatus } from "./invoiceStatus";

export class EditInvoiceViewModel{

    id                  : string;  
    maturity            : Date; 
    totalValue          : number;
    fee                 : number;
    valueToPay          : number;
    status              : InvoiceStatus;

}