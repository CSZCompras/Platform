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
import { SupplierProductStatus } from '../../../domain/SupplierProductStatus';


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
        
        this.isFiltered = true;
        this.isLoaded = false;
    } 
    
    attached() : void{  

        this.loadData();
        this.ea.subscribe('supplierProductRemoved', (product : SupplierProduct) => {
            
            if(this.selectedCategory == product.product.category.id){
                this.loadProducts();
            }
        });
    } 

    loadData(){ 

 
        this.productRepository
            .getAllCategories()
            .then( (data : ProductCategory[]) => { 
                this.categories = data;
                this.selectedCategory = this.categories[0].id;
                this.loadProducts();

            }).catch( e => {
                this.nService.presentError(e);
            });
 
    }

    loadProducts() : Promise<any>{

        this.isLoaded = false;
        this.allProducts = [];
        this.filteredProducts = [];
                
        return this.productRepository
                    .getOfferedProducts(this.selectedCategory)
                    .then( (data : Product[]) => {
                        this.allProducts = data;
                        this.filteredProducts = data;
                        this.isLoaded = true;
                        this.ea.publish('selecaoDeProdutosLoaded'); 

                    }).catch( e => {
                        this.nService.presentError(e);
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
        supplierProduct.status = SupplierProductStatus.Active;
        this.isFiltered = true;
        
        ( <any> product).supplierProduct = supplierProduct; 
        this.isEditing = true;
    }

    saveProduct(product : Product){  

        var supplierProduct = <SupplierProduct> ( <any> product).supplierProduct;
        
        // Remove the virtual property (circular reference!)
        ( <any> product).supplierProduct = null;
  
        supplierProduct.status = SupplierProductStatus.Active;
        this.isFiltered = true; 
        ( <any> product).isLoading = true;

        this.repository
            .addProduct(supplierProduct)
            .then( (data : SupplierProduct) => { 
            
                this.allProducts = this.allProducts.filter( (x : Product) => x.id != product.id);

                this.filteredProducts = this.filteredProducts.filter( (x : Product) => x.id != product.id);

                this.nService.presentSuccess('Produto incluído com sucesso!'); 

                this.ea.publish('productAdded', data);
                ( <any> product).isLoading = false;
                
                this.isEditing = false;
            }).catch( e => {
                this.nService.presentError(e);
                ( <any> product).isLoading = false;
            });
        
    }

}