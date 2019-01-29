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

@autoinject
export class ListProduct{

    products                    : Product[];
    filteredProducts            : Product[];
    categories                  : ProductCategory[];
    units                       : UnitOfMeasurement[];
    selectedCategory            : string;
    selectedCategoryProduct     : string;
    filter                      : string;
    isEditing                   : boolean;
    product                     : Product;
    selectedUnit                : UnitOfMeasurement

    constructor(		
		private router              : Router, 
		private ea                  : EventAggregator,
		private service             : IdentityService,
        private nService            : NotificationService,
        private repository          : ProductRepository ,
        private unitRepository      : UnitOfMeasurementRepository,
        private  productRepository  : ProductRepository) {

            this.units = [];
    } 

    attached(){
        this.ea.publish('loadingData'); 
        this.loadData();
    }

    loadData(){
         

        this.productRepository
               .getAllCategories()
               .then( (data : ProductCategory[]) => { 
                   this.categories = data;
                   this.ea.publish('dataLoaded');
               }).catch( e => {
                   this.nService.presentError(e);
               });

        this.unitRepository
            .getAll()
            .then( (data : UnitOfMeasurement[]) => { 
                this.units = data;
            }).catch( e => {
                this.nService.presentError(e);
            });
    }

    searchProducts(){  
        
        this.repository
            .getAllProductsByCategory(this.selectedCategory)
            .then(x => {
                this.products = x;
                this.filteredProducts = x;
                this.search(); 
            })
            .catch( e => {
                this.nService.presentError(e);
            }); 

    }

    search(){

        this.filteredProducts = this.products.filter( (x :Product) =>{

            var isFound = true; 

                if( (this.selectedCategory != null && this.selectedCategory != '')){ 
                    if(x.category.id == this.selectedCategory){
                        isFound = true;
                    }
                    else {
                        isFound= false;
                    }
                }
           

                if(isFound){

                    if( (this.filter != null && this.filter != '')){ 
                        if( 
                                x.name.toUpperCase().includes(this.filter.toUpperCase()) 
                            ||  x.category.name.toUpperCase().includes(this.filter.toUpperCase()) 
                            ||  x.brand != null && x.brand.name.toUpperCase().includes(this.filter.toUpperCase()) ){
                            isFound = true;
                        }
                        else {
                            isFound= false;
                        }
                    } 
                }

                if(isFound){
                    return x;
                }
        });
    }

    edit(product : Product){

        this.isEditing = true;
        this.product = product;
        this.product.category = this.categories.filter( x => x.id == this.product.category.id)[0];
        this.product.unit = this.units.filter( x => x.id == this.product.unit.id)[0];
    }

    create(){

        this.product = new Product();
        this.isEditing = true;
        this.product.isActive = true;
    }

    cancel(){

        this.isEditing = false;
        this.product = null;
    }

    addOrUpdate(){

        this.repository
            .addOrUpdate(this.product)
            .then(x => {               

                this.product = null;
                this.loadData();
                this.isEditing = false;
            })
            .catch( e => {
                this.nService.presentError(e);
            }); 
    }

}