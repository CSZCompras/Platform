import { User } from "./user";
import { Invoice } from "./invoice";

export class InvoiceControl{

    id                  : string;
    dateReference       : Date;
    dateLabel           : string;
    canGenerateInvoices : boolean;
    createdOn           : Date;
    createdBy           : User; 
    invoices            : Invoice[];
}