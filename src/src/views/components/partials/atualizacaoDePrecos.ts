import { SupplierProduct } from '../../../domain/supplierProduct';
import { ProductRepository } from '../../../repositories/productRepository';
import { NotificationService } from '../../../services/notificationService';
import { IdentityService } from '../../../services/identityService';
import { ProductCategory } from '../../../domain/productCategory';
import { ProductClass } from '../../../domain/productClass';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Product } from "../../../domain/product";
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class AtualizacaoDePrecos{

    newProducts : SupplierProduct[];

    constructor(		
        private router: Router, 
		private service : IdentityService,
		private nService : NotificationService, 
        private ea : EventAggregator ,
        private repository : ProductRepository) {

            this.newProducts = [];
    } 

    attached(){
        this.loadData(); 

        this.ea.subscribe('productAdded', (product : Product) =>{
            
            var supplierProduct = new SupplierProduct();
            supplierProduct.product = product;
            supplierProduct.isActive = true;
            this.newProducts.push(supplierProduct);
        })
    }

    loadData(){
        
    }
}