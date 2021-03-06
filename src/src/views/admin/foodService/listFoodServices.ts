import { inject, NewInstance} from 'aurelia-framework';
import { Aurelia, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';
import { EventAggregator } from 'aurelia-event-aggregator';
import { IdentityService } from '../../../services/identityService';
import { NotificationService } from '../../../services/notificationService';
import { ProductRepository } from '../../../repositories/productRepository';
import { Product } from '../../../domain/product';
import { ProductCategory } from '../../../domain/productCategory';
import { UnitOfMeasurementRepository } from '../../../repositories/unitOfMeasurementRepository';
import { UnitOfMeasurement } from '../../../domain/unitOfMeasurement';
import { Supplier } from '../../../domain/supplier';
import { SupplierRepository } from '../../../repositories/supplierRepository';
import { SupplierStatus } from '../../../domain/supplierStatus';
import { stat } from 'fs';
import { FoodService } from '../../../domain/foodService';
import { FoodServiceRepository } from '../../../repositories/foodServiceRepository';
import { FoodServiceStatus } from '../../../domain/foodServiceStatus';

@autoinject
export class ListFoodServices{

    foodServices                    : FoodService[];
    filteredFoodServices            : FoodService[];
    filter                          : string;
    selectedStatus                  : string;

    constructor(
        private router              : Router, 
        private ea                  : EventAggregator,
        private nService            : NotificationService,
        private repository          : FoodServiceRepository) { 

        this.foodServices = [];
    }

    attached(){

        this.ea.publish('loadingData'); 
        this.loadData();
    }

    loadData(){

        this.repository
            .getAll()
            .then(x =>{

                this.foodServices = x;
                this.filteredFoodServices = x;
                this.ea.publish('dataLoaded');
            })
            .catch( e => {
                this.nService.presentError(e);
            });

    }

    search(){

        this.filteredFoodServices = this.foodServices.filter( (x : FoodService) =>{

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
        this.router.navigateToRoute('editFoodServiceAdmin', { foodId : x.id });
    }

    editStatus(x : FoodService, status : FoodServiceStatus){
        
        this.repository
            .updateStatus(x.id, status)
            .then( () => {
                x.status = status;
                this.nService.presentSuccess('Status atualizado com sucesso!');
            })
            .catch(e => this.nService.presentError(e));
    }

    inactivate(x : Supplier){
        this.router.navigateToRoute('editFoodServiceAdmin', { foodId : x.id });
    }
}