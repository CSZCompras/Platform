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
export class SelecaoDeProdutos{
    
    classes : ProductClass[];
    categories : ProductCategory[];
    allProducts : Product[];
    filteredProducts : Product[];
    isFiltered : boolean;
    selectedCategory : string;
    filter : string;

    constructor(		
        private router: Router, 
		private service : IdentityService,
		private nService : NotificationService, 
        private ea : EventAggregator ,
        private  productRepository : ProductRepository,
        private repository : FoodServiceRepository) {
        
        this.isFiltered = false;
    } 
    
    attached() : void{ 
		this.loadData(); 
    } 

    loadData(){

        this. productRepository
            .getAllCategories()
            .then( (data : ProductCategory[]) => { 
                this.categories = data;
            }).catch( e => {
                this.nService.presentError(e);
            });

        this. productRepository
            .getAllProducts()
            .then( (data : Product[]) => { 
                this.allProducts = data;
            }).catch( e => {
                this.nService.presentError(e);
            });
    }

    search(){ 
        if( (this.selectedCategory == null || this.selectedCategory == '') && (this.filter == null || this.filter == '') ) {
            this.isFiltered = false;
        }
        else{
            
            this.isFiltered = true;

            this.filteredProducts = this.allProducts.filter( (x : Product) =>{

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

        var foodProduct = new FoodServiceProduct();
        foodProduct.product = product;
        foodProduct.isActive = true;         
        this.isFiltered = true;
        

        this.repository.addProduct(foodProduct)
                        .then( (data : FoodServiceProduct) => { 
                        
                            this.allProducts = this.allProducts.filter( (x : Product) => {
                                if(x.id != product.id)
                                    return x;
                            });

                            this.filteredProducts = this.filteredProducts.filter( (x : Product) => {
                                if(x.id != product.id)
                                    return x;
                            });
                            this.nService.presentSuccess('Produto incluído com sucesso!'); 

                            this.ea.publish('productAdded', foodProduct);
                        }).catch( e => {
                            this.nService.presentError(e);
                        });
        
    }

}