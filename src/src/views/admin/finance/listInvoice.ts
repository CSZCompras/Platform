import { inject, NewInstance} from 'aurelia-framework';
import { Aurelia, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';
import { EventAggregator } from 'aurelia-event-aggregator';
import { NotificationService } from '../../../services/notificationService';
import { InvoiceControl } from '../../../domain/invoiceControl';
import { FinanceRepository } from '../../../repositories/financeRepository';
import { Invoice } from '../../../domain/invoice';
import { InvoiceStatus } from '../../../domain/invoiceStatus';
import { EditInvoiceViewModel } from '../../../domain/editInvoiceViewModel';

@autoinject
export class ListInvoice{

    filter                          : string;
    selectedStatus                  : string;
    controls                        : InvoiceControl[];
    filteredInvoices                : Invoice[]
    selectedInvoice                 : Invoice;
    selectedControl                 : InvoiceControl;
    isLoading                       : boolean;
    isEditing                       : boolean;
    totalValue                      : number;
    totalValuePaid                  : number;

    constructor(
        private router              : Router, 
        private ea                  : EventAggregator,
        private nService            : NotificationService,
        private repository          : FinanceRepository) { 

        this.controls = [];
    }

    attached(){

        this.ea.publish('loadingData'); 
        this.loadData();
    }

    changeControl(){        
        this.filteredInvoices = this.selectedControl.invoices;
        this.search();
        this.calculateTotalValue();
    }

    calculateTotalValue(){

        if(this.selectedControl.invoices != null){
            this.totalValue =  this.selectedControl.invoices.reduce((sum, current) => sum + current.valueToPay, 0);
            this.totalValuePaid =  this.selectedControl.invoices.filter(x => x.status == InvoiceStatus.Paid).reduce((sum, current) => sum + current.valueToPay, 0);
        }
    }

    loadData(){

        this.repository
            .getControls()
            .then(x =>{
                this.controls = x;
                if(x.length > 0){
                    this.selectedControl = x[0];
                    this.filteredInvoices = x[0].invoices;
                    this.calculateTotalValue();
                }
                this.ea.publish('dataLoaded');
            })
            .catch( e => {
                this.nService.presentError(e);
            });

    } 

    generateInvoices(){
        
        this.isLoading = true;

        this.repository
            .generateInvoices(this.selectedControl)
            .then(x =>{                
                this.selectedControl.invoices = x;
                this.filteredInvoices = x;

                if(this.filteredInvoices.length == 0){ 
                    this.nService.presentError('Não há pedidos para gerar o faturamento');
                }
                this.calculateTotalValue();
                this.selectedControl.canGenerateInvoices = false;
                this.isLoading = false;
            })
            .catch( e => {
                this.nService.presentError(e);
                this.isLoading = false;
            });
    } 

    edit(invoice : Invoice){

        this.isEditing = true;
        this.selectedInvoice = invoice; 
        this.setInvoiceValues();
    }

    cancelEdit(){

        this.isEditing = false;
    }

    setInvoiceValues(){

        if( ( <any> this.selectedInvoice).originalPrice == null){
            ( <any> this.selectedInvoice).originalPrice = this.selectedInvoice.totalValue;
        }

        if( ( <any> this.selectedInvoice).originalFee == null){
            ( <any> this.selectedInvoice).originalFee = this.selectedInvoice.fee;
        } 
    }

    editStatus(invoice : Invoice, status : InvoiceStatus){

        invoice.status = status;
        this.selectedInvoice = invoice;
        this.saveInvoice();
    }

    saveInvoice(){

        this.isLoading = true;
        ( <any> this.selectedInvoice).isEditing = true;

        var edit = new EditInvoiceViewModel();
        edit.id = this.selectedInvoice.id;
        edit.fee = this.selectedInvoice.fee;
        edit.maturity = this.selectedInvoice.maturity;
        edit.status = this.selectedInvoice.status;
        edit.totalValue = this.selectedInvoice.totalValue;
        edit.valueToPay = this.selectedInvoice.valueToPay;

        this.repository
            .saveInvoice(edit)
            .then(x =>{    
                this.nService.presentSuccess('Fatura atualizada com sucesso!');
                this.isLoading = false;
                ( <any> this.selectedInvoice).isEditing = false;
                this.calculateTotalValue();
            })
            .catch( e => {
                this.nService.presentError(e);
                this.isLoading = false;
                ( <any> this.selectedInvoice).isEditing = false;
            });
    }


    calculateInvoicePrice(){

        this.selectedInvoice.valueToPay = this.selectedInvoice.totalValue * (this.selectedInvoice.fee / 100);

    }

    cancelEditInvoicePrice(){

        if( ( <any> this.selectedInvoice).originalPrice != null){
            this.selectedInvoice.totalValue = ( <any> this.selectedInvoice).originalPrice;
        } 
        
        if( ( <any> this.selectedInvoice).originalFee != null){
            this.selectedInvoice.fee = ( <any> this.selectedInvoice).originalFee;
        }

        this.calculateInvoicePrice();
    }

    search(){

        this.filteredInvoices = this.selectedControl.invoices.filter( (x : Invoice) =>{

            var isFound = true;  

            if( (this.selectedStatus != null && this.selectedStatus != '')){ 
                if(x.status.toString() == this.selectedStatus){
                    isFound = true;
                }
                else {
                    isFound= false;
                }
            }

            if( (this.filter != null && this.filter != '')){ 
                if(x.supplier.name.toUpperCase().includes(this.filter.toUpperCase())){
                    isFound = true;
                }
                else {
                    isFound= false;
                }
            }  

            if(isFound){
                return x;
            }
        });

    } 
}