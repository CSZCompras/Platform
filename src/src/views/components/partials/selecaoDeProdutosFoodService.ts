import { ProductRepository } from '../../../repositories/productRepository';
import { NotificationService } from '../../../services/notificationService';
import { IdentityService } from '../../../services/identityService';
import { ProductCategory } from '../../../domain/productCategory';
import { ProductClass } from '../../../domain/productClass';
import { autoinject } from 'aurelia-framework';
import { Product } from "../../../domain/product";
import { EventAggregator } from 'aurelia-event-aggregator';
import { FoodServiceRepository } from '../../../repositories/foodServiceRepository';
import { FoodServiceProduct } from '../../../domain/foodServiceProduct'; 
import { ProductBaseRepository } from '../../../repositories/productBaseRepository';
import { ProductBase } from '../../../domain/productBase';


@autoinject
export class SelecaoDeProdutosFoodService{
    
    classes             : ProductClass[];
    categories          : ProductCategory[];
    allProducts         : ProductBase[];
    filteredProducts    : ProductBase[];
    isFiltered          : boolean;
    selectedCategory    : ProductCategory;
    selectedClass       : ProductClass;
    filter              : string;
    isProcessing        : boolean;
    isLoading           : boolean;

    constructor(		
		private service                 : IdentityService,
		private nService                : NotificationService, 
        private ea                      : EventAggregator ,
        private productRepository       : ProductRepository,
        private productBaseRepository   : ProductBaseRepository,
        private repository              : FoodServiceRepository) {
        
        this.isFiltered = false;
        this.isProcessing = false;
    } 
    
    attached() : void{ 
        
		this.loadData(); 
        
        this.ea.subscribe('productRemoved', (fp : FoodServiceProduct) => { 
            this.loadData();
        }); 
    } 

    updateCategory(){
        this.selectedCategory = this.selectedClass.categories[0];
        this.search();
    }

    loadData(){

        this.allProducts = [];
        this.filteredProducts = [];
        this.isFiltered = false;
        this.isLoading = true;

        var promisse0 = this.productRepository
                            .getAllClasses()
                            .then( (data : ProductClass[]) => { 
                                this.classes = data
                                this.selectedClass = data[0];
                                this.selectedCategory = this.selectedClass.categories[0];
                            })
                            .catch( e => this.nService.presentError(e));

        var promisse1 = this.productBaseRepository
                            .getAllProducts()
                            .then( (data : ProductBase[]) => { 
                                this.allProducts = data
                            })
                            .catch( e => this.nService.presentError(e));

        Promise.all([promisse0, promisse1]).then( () => { 

            this.search();
            this.ea.publish('dataLoaded');
            this.isLoading = false;
        });
    }

    search(){ 

        if( (this.selectedCategory == null || this.selectedCategory.id == '') && (this.filter == null || this.filter == '') ) {
            this.isFiltered = false;
        }
        else{
            
            this.isFiltered = true;

            this.filteredProducts = this.allProducts.filter( (x : ProductBase) =>{

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

    addProduct(product : Product, base : ProductBase){ 
        
        ( <any> product).isLoading = true;

        this.isProcessing = true;

        var foodProduct = new FoodServiceProduct();
        foodProduct.product = product;
        foodProduct.isActive = true;         
        this.isFiltered = true;
        

        this.repository
            .addProduct(foodProduct)
            .then( (data : FoodServiceProduct) => {  
                
                base.products = base.products.filter( x => x.id != product.id);           
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