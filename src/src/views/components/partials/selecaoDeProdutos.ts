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
import { SupplierRepository } from '../../../repositories/supplierRepository';
import { SupplierProduct } from '../../../domain/supplierProduct';


@autoinject
export class SelecaoDeProdutos{
    
    classes             : ProductClass[];
    categories          : ProductCategory[];
    allProducts         : Product[];
    filteredProducts    : Product[];
    isFiltered          : boolean;
    selectedCategory    : string;
    filter              : string;
    isEditing           : boolean;
    isLoaded            : boolean;

    constructor(		
        private router: Router, 
		private service : IdentityService,
		private nService : NotificationService, 
        private ea : EventAggregator ,
        private  productRepository : ProductRepository,
        private repository : SupplierRepository) {
        
        this.isFiltered = false;
        this.isLoaded = false;
    } 
    
    attached() : void{  

        this.loadData();
    } 

    loadData(){ 


     var promisseCategories =
        this.productRepository
            .getAllCategories()
            .then( (data : ProductCategory[]) => { 
                this.categories = data;
            }).catch( e => {
                this.nService.presentError(e);
            });

        var promisseProducts =
            this.productRepository
                .getAllProducts()
                .then( (data : Product[]) => {
                    this.allProducts = data;

                }).catch( e => {
                    this.nService.presentError(e);
                });

        Promise.all([promisseCategories, promisseProducts])
               .then( () => {

                   this.isLoaded = true;
                   this.ea.publish('selecaoDeProdutosLoaded'); 
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

    includeProduct(product : Product){


        var supplierProduct = new SupplierProduct();
        supplierProduct.product = product;
        supplierProduct.isActive = true;         
        this.isFiltered = true;
        
        ( <any> product).supplierProduct = supplierProduct; 
        this.isEditing = true;
    }

    saveProduct(product : Product){  

        var supplierProduct = <SupplierProduct> ( <any> product).supplierProduct;
        
        // Remove the virtual property (circular reference!)
        ( <any> product).supplierProduct = null;
  
        supplierProduct.isActive = true;         
        this.isFiltered = true;
        


        this.repository
            .addProduct(supplierProduct)
            .then( (data : SupplierProduct) => { 
            
                this.allProducts = this.allProducts.filter( (x : Product) => x.id != product.id);

                this.filteredProducts = this.filteredProducts.filter( (x : Product) => x.id != product.id);

                this.nService.presentSuccess('Produto incluído com sucesso!'); 

                this.ea.publish('productAdded', data);
                
                this.isEditing = false;
            }).catch( e => {
                this.nService.presentError(e);
            });
        
    }

}