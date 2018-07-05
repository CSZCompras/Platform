import { inject, NewInstance} from 'aurelia-framework';
import { Aurelia, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
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
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';

@autoinject
export class EditSupplier{

    supplier    : Supplier;
    supplierId  : string;

    constructor(
        private router              : Router, 
        private ea                  : EventAggregator,
        private nService            : NotificationService,
        private repository          : SupplierRepository) { 

            this.supplier = new Supplier();
    }

    attached(){

        this.ea.publish('loadingData'); 
        this.loadData();
    }

    
    activate(params){ 

        if(params != null && params.supplierId){ 

            this.supplierId = params.supplierId;
        } 
    }


    loadData(){

        this.repository
            .get(this.supplierId)
            .then(x => {
                this.supplier = x;                
                this.ea.publish('dataLoaded');
            })
            .catch( e => {
                this.nService.presentError(e);
            });

    }

}