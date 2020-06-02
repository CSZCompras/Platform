import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { NotificationService } from '../../../services/notificationService';
import { Supplier } from '../../../domain/supplier';
import { SupplierRepository } from '../../../repositories/supplierRepository';
import { SupplierStatus } from '../../../domain/supplierStatus';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';

@autoinject
export class ListSuppliers{

    suppliers                       : Supplier[];
    filteredSuppliers               : Supplier[];
    filter                          : string;
    selectedStatus                  : string;

    constructor(
        private router              : Router, 
        private ea                  : EventAggregator,
        private nService            : NotificationService,
        private repository          : SupplierRepository) { 

        this.suppliers = [];
    }

    attached(){

        this.ea.publish('loadingData'); 
        this.loadData();
    }

    loadData(){

        this.repository
            .getAllSuppliers()
            .then(x =>{

                this.suppliers = x;
                this.filteredSuppliers = x;
                this.ea.publish('dataLoaded');
            })
            .catch( e => {
                this.nService.presentError(e);
            });

    }

    search(){

        this.filteredSuppliers = this.suppliers.filter( (x : Supplier) =>{

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
                if( 
                        x.name.toUpperCase().includes(this.filter.toUpperCase()) 
                    ||  x.contact.name.toUpperCase().includes(this.filter.toUpperCase()) 
                    ||  x.contact.email.toUpperCase().includes(this.filter.toUpperCase()) ){
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

    edit(x : Supplier){
        this.router.navigateToRoute('editSupplierAdmin', { supplierId : x.id });
    }

    editStatus(x : Supplier, status : SupplierStatus){
        
        this.repository
            .updateStatus(x.id, status)
            .then( () => {
                x.status = status;
                this.nService.presentSuccess('Status atualizado com sucesso!');
            })
            .catch(e => this.nService.presentError(e));
    }

    inactivate(x : Supplier){
        this.router.navigateToRoute('editSupplierAdmin', { supplierId : x.id });
    }
}