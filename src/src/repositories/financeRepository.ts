import { Rest, Config } from "aurelia-api";
import { Evaluation } from "../domain/evaluation";
import { EvaluationStatus } from "../domain/evaluationStatus";
import { autoinject } from "aurelia-dependency-injection";
import { InvoiceControl } from "../domain/invoiceControl";
import { Invoice } from "../domain/invoice";
import { EditInvoiceViewModel } from "../domain/editInvoiceViewModel";


@autoinject
export class FinanceRepository{
    

    api         : Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('apiAddress');
    }

    getControls() : Promise<InvoiceControl[]>  {

        return this.api
                    .find('invoiceControl')
                    .then( (result : Promise<InvoiceControl[]>) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }

    generateInvoices(selectedControl: InvoiceControl) : Promise<Invoice[]>{
        return this.api
                    .post('invoice', { dateReference :  selectedControl.dateReference } )
                    .then( (result : Promise<InvoiceControl[]>) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }

    saveInvoice(invoice : EditInvoiceViewModel) : Promise<any> {

        debugger;
        
        return this.api
                    .post('editInvoice', invoice)
                    .then( (result : Promise<InvoiceControl[]>) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    } 
}