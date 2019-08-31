import { ProductRepository } from '../../../repositories/productRepository';
import { NotificationService } from '../../../services/notificationService';
import { IdentityService } from '../../../services/identityService';
import { ProductCategory } from '../../../domain/productCategory';
import { ProductClass } from '../../../domain/productClass';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Product } from "../../../domain/product";
import { EventAggregator } from 'aurelia-event-aggregator';
import { FoodServiceRepository } from '../../../repositories/foodServiceRepository';
import { FoodServiceProduct } from '../../../domain/foodServiceProduct'; 


@autoinject
export class SelecaoDeProdutosFoodService{
    
    classes             : ProductClass[];
    categories          : ProductCategory[];
    allProducts         : Product[];
    filteredProducts    : Product[];
    isFiltered          : boolean;
    selectedCategory    : ProductCategory;
    selectedClass       : ProductClass;
    filter              : string;
    isProcessing        : boolean;

    constructor(		
		private service         : IdentityService,
		private nService        : NotificationService, 
        private ea              : EventAggregator ,
        private productRepository : ProductRepository,
        private repository      : FoodServiceRepository) {
        
        this.isFiltered = false;
        this.isProcessing = false;
    } 
    
    attached() : void{ 
        
		this.loadData(); 
        
        this.ea.subscribe('productRemoved', (x : FoodServiceProduct) => { 

            this.allProducts.unshift(x.product);
            this.search(); 
        }); 
    } 

    updateCategory(){
        this.selectedCategory = this.selectedClass.categories[0];
        this.search();
    }

    loadData(){

        var promisse0 = this. productRepository
                            .getAllClasses()
                            .then( (data : ProductClass[]) => { 
                                this.classes = data
                                this.selectedClass = data[0];
                                this.selectedCategory = this.selectedClass.categories[0];
                            })
                            .catch( e => this.nService.presentError(e));

        var promisse1 = this. productRepository
                            .getAllProducts()
                            .then( (data : Product[]) => { 
                                this.allProducts = data
                            })
                            .catch( e => this.nService.presentError(e));

        Promise.all([promisse0, promisse1]).then( () => { 

            this.search();
            this.ea.publish('dataLoaded');
        });
    }

    search(){ 

        if( (this.selectedCategory == null || this.selectedCategory.id == '') && (this.filter == null || this.filter == '') ) {
            this.isFiltered = false;
        }
        else{
            
            this.isFiltered = true;

            this.filteredProducts = this.allProducts.filter( (x : Product) =>{

                var isFound = true;

                if( (this.selectedCategory != null && this.selectedCategory.id != '')){ 
                    if(x.category.id == this.selectedCategory.id){
                        isFound = true;
                    }
                    else {
                        isFound= false;
                    }
                }
                
                if(isFound){

                    if( (this.filter != null && this.filter != '')){ 
                        if( x.name.toUpperCase().includes(this.filter.toUpperCase()) ){
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
    }

    addProduct(product : Product){

        var user = this.service.getIdentity();

        ( <any> product).isLoading = true;

        this.isProcessing = true;

        var foodProduct = new FoodServiceProduct();
        foodProduct.product = product;
        foodProduct.isActive = true;         
        this.isFiltered = true;
        

        this.repository
            .addProduct(foodProduct)
            .then( (data : FoodServiceProduct) => {  
                            
                this.filteredProducts = this.filteredProducts.filter( (x : Product) => x.id != product.id ); 
                 
                this.allProducts = this.allProducts.filter( (x : Product) => x.id != product.id );

                this.nService.presentSuccess('Produto incluído com sucesso!');   

                this.ea.publish('productAdded', data );
                this.isProcessing = false;
                ( <any> product).isLoading = true;
                            
            }).catch( e => {
                this.nService.presentError(e);
                this.isProcessing = false;
                ( <any> product).isLoading = true;
            });
        
    }

}