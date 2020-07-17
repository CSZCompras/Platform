import { ProductRepository } from '../../../repositories/productRepository';
import { NotificationService } from '../../../services/notificationService'; 
import { ProductCategory } from '../../../domain/productCategory';
import { ProductClass } from '../../../domain/productClass';
import { autoinject } from 'aurelia-framework'; 
import { Product } from "../../../domain/product";
import { EventAggregator } from 'aurelia-event-aggregator';
import { SupplierRepository } from '../../../repositories/supplierRepository';
import { SupplierProduct } from '../../../domain/supplierProduct';
import { SupplierProductStatus } from '../../../domain/supplierProductStatus';
import { ProductBase } from '../../../domain/productBase';
import { ProductBaseRepository } from '../../../repositories/productBaseRepository';


@autoinject
export class SelecaoDeProdutos{
    
    classes             : ProductClass[];
    categories          : ProductCategory[];
    selectedClass       : ProductClass; 
    selectedCategory    : ProductCategory;
    allProducts         : ProductBase[];
    filteredProducts    : ProductBase[];
    isFiltered          : boolean;
    filter              : string;
    isEditing           : boolean;
    isLoaded            : boolean;

    constructor(		
		private nService                : NotificationService, 
        private ea                      : EventAggregator ,
        private productRepository       : ProductRepository,
        private productBaseRepository   : ProductBaseRepository,
        private repository              : SupplierRepository) {
        
        this.isFiltered = true;
        this.isLoaded = false;
    } 
    
    attached() : void{  

        this.loadData();
        
        this.ea.subscribe('supplierProductRemoved', (product : SupplierProduct) => { 

            if(this.selectedCategory.id == product.product.base.category.id){
                this.loadProducts();
            }
        });
    } 

    loadData(){ 

 
        this.productRepository
            .getAllClasses()
            .then( (data : ProductClass[]) => { 
                this.classes = data; 
                if(data.length > 0){
                    
                    this.selectedClass = data[0];
                    
                    if(data[0].categories.length > 0){
                        this.selectedCategory = data[0].categories[0];
                    }
                }
                
                this.loadProducts();
                this.ea.publish('selecaoDeProdutosLoaded'); 
                this.isLoaded = true; 
            }).catch( e => {
                this.nService.presentError(e);
            });
 
    }

    loadProducts() : Promise<any>{

        this.isLoaded = false;
        this.allProducts = [];
        this.filteredProducts = [];

        if(this.selectedCategory != null){
                
            return this.productBaseRepository
                        .getOfferedProducts(this.selectedCategory.id)
                        .then( (data : ProductBase[]) => {
                            this.allProducts = data;
                            this.filteredProducts = data;
                            this.isLoaded = true;
                        }).catch( e => {
                            this.nService.presentError(e);
                            this.isLoaded = true;
                        });

        }

    }

    updateCategories(){
        this.selectedCategory = this.selectedClass.categories[0];
        this.loadProducts();

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
                this.loadProducts();
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