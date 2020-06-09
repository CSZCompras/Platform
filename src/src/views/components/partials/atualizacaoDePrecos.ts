import { SupplierProductFileRow } from '../../../domain/supplierProductFileRow';
import { SupplierProductFile } from '../../../domain/supplierProductFile';
import { Config } from 'aurelia-api'; 
import { SupplierProduct } from '../../../domain/supplierProduct';
import { ProductRepository } from '../../../repositories/productRepository';
import { NotificationService } from '../../../services/notificationService';
import { IdentityService } from '../../../services/identityService';
import { ProductCategory } from '../../../domain/productCategory';
import { ProductClass } from '../../../domain/productClass';
import { autoinject } from 'aurelia-framework'; 
import { EventAggregator } from 'aurelia-event-aggregator'; 
import { SupplierProductStatus } from '../../../domain/supplierProductStatus';

@autoinject
export class AtualizacaoDePrecos{ 

    supplierProducts    : Array<SupplierProduct>; 
    filteredProducts    : Array<SupplierProduct>; 
    selectedFiles       : any; 
    isUploading         : boolean;
    classes             : ProductClass[];
    categories          : ProductCategory[];
    selectedClass       : ProductClass;
    selectedCategory    : ProductCategory;
    filter              : string;
    alteredProducts     : Array<SupplierProduct>; 
    isLoading           : boolean;

    constructor(		
		private service             : IdentityService,
		private nService            : NotificationService, 
        private ea                  : EventAggregator ,
        private  productRepository  : ProductRepository,
        private config              : Config,
        private repository          : ProductRepository) { 

            this.filteredProducts = new Array<SupplierProduct>();
            this.supplierProducts = new Array<SupplierProduct>();
            this.alteredProducts = new Array<SupplierProduct>();
            this.isLoading = true; 
    } 

    attached(){

        this.loadData(true); 

        this.ea.subscribe('productAdded', (product : SupplierProduct) =>{
            
            (<any>product).isNew = true;
            this.supplierProducts.push(product);   
            this.isLoading = true;                    
            this.supplierProducts = this.supplierProducts.sort( (a : SupplierProduct, b : SupplierProduct) => 0 - (a.product.base.name > b.product.base.name ? -1 : 1));
            this.loadData(false).then( () => this.search());
        }) 
    }

    loadData(loadProducts : boolean) : Promise<any>{  
        debugger;  

     return    this.productRepository
               .getClassesByOfferedProducts()
               .then( (data : ProductClass[]) => {  
                   this.classes = data;

                   if(this.selectedCategory == null &&  data.length > 0){
                        if(data[0].categories.length > 0){
                            this.selectedCategory = data[0].categories[0];
                        }
                   }
                   else {
                       var selectedCtg= this.selectedCategory;
                       var classFiltered = data.filter( (x : ProductClass) => x.id == this.selectedClass.id);

                       if(classFiltered.length > 0){
                            this.selectedClass = classFiltered[0];
                        
                            var filteredCategory = this.selectedClass.categories.filter( (x : ProductCategory) => x.id == selectedCtg.id);
                        
                            if(filteredCategory.length > 0){
                                this.selectedCategory = filteredCategory[0];
                            }
                        }
                   }
                   this.ea.publish('atualizacaoDePrecosLoaded');
                   if(loadProducts){
                        this.loadProducts();
                   }
                   else{
                       this.isLoading = false;
                   }
               }).catch( e => {
                   this.nService.presentError(e);
               });
    } 

    updateCategories(){
        this.selectedCategory = this.selectedClass.categories[0];
        this.loadProducts();
    }

    loadProducts(){

        this.isLoading = true; 
        this.supplierProducts = [];
        this.filteredProducts = []; 
        this.alteredProducts = [];  
        this.filter = '';
        
        if(this.selectedCategory != null){
            this.repository
                .getAllSuplierProducts(this.selectedCategory.id)            
                .then( (data : SupplierProduct[]) => {
                    this.supplierProducts = data;
                    this.filteredProducts = data;  
                    this.isLoading = false; 

                }).catch( e => {
                    this.nService.presentError(e);
                });
        }
    }

    search(){

        this.filteredProducts = this.supplierProducts.filter( (x : SupplierProduct) =>{

            var isFound = true; 

                if( (this.selectedCategory != null && this.selectedCategory.id != '')){ 
                    if(x.product.base.category.id == this.selectedCategory.id){
                        isFound = true;
                    }
                    else {
                        isFound= false;
                    }
                }
           

                if(isFound){

                    if( (this.filter != null && this.filter != '')){ 
                        if( 
                                x.product.base.name.toUpperCase().includes(this.filter.toUpperCase()) 
                            ||  x.product.base.category.name.toUpperCase().includes(this.filter.toUpperCase()) 
                            ||  x.product.brand != null && x.product.brand.name.toUpperCase().includes(this.filter.toUpperCase()) 
                        ){
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

    edit(product : SupplierProduct){
        ( <any> product).isEditing = true;
        ( <any> product).oldPrice  = product.price;
        ( <any> product).oldStatus  = product.status;
    }

    cancelEdit(product : SupplierProduct){
        ( <any> product).isEditing = false;
        ( <any> product).walAltered = false;
        product.price  = ( <any> product).oldPrice;
        product.status  = ( <any> product).oldStatus;

        this.alteredProducts = this.alteredProducts.filter(x => x.id != product.id);
    }

    alterStatus(product : SupplierProduct, status : SupplierProductStatus){
        
        product.status = status; 

    }

    save(product  :SupplierProduct){

        this.alteredProducts.push(product);
        ( <any> product).isEditing = false;
        ( <any> product).wasAltered = true;
        ( <any> product).isLoading = true;

        this.repository
            .alterSuplierProduct(this.alteredProducts)
            .then( (result : any) =>{    
                
                this.nService.success('O produto foi atualizado com sucesso!');  
                this.isLoading = false;
                this.ea.publish('uploadSupplierProductFileDone');
                this.alteredProducts = [];
                ( <any> product).isLoading = false;

                if(product.status == SupplierProductStatus.Removed){
                    this.filteredProducts = this.filteredProducts.filter( x => x.id != product.id);
                    this.supplierProducts = this.supplierProducts.filter( x => x.id != product.id);
                    this.ea.publish('supplierProductRemoved', product);
                }

            }).catch( e => {
                this.nService.error(e);
                this.isLoading = false;
            });

    }

    downloadFile(){ 
        var userId = this.service.getIdentity().id
        var api = this.config.getEndpoint('csz');
        window.open(api.client.baseUrl + 'downloadSupplierProducts?userId=' + userId, '_parent');
    }

    uploadFile() { 
        
        this.isUploading = true;

        let formData = new FormData();

        for (let i = 0; i < this.selectedFiles.length; i++) {
            formData.append('file', this.selectedFiles[i]);
        }

        this.repository
            .uploadFile(formData) 
            .then( (result : SupplierProductFile) =>{                    
                
                this.loadData(true);

                if(result.rows != null && result.rows.length > 0){
                    var hasErrors = result.rows.filter( (x : SupplierProductFileRow) => x.status == 1).length > 0
                    
                    if(hasErrors)
                    {
                        this.nService.error('Foram encontrados erros no arquivo. Verifique os detalhes no histórico de importação');
                    }
                    else{
                        this.nService.success('O arquivo foi processado com sucesso');
                    }
                }
                else{
                    this.nService.success('O arquivo foi processado com sucesso');
                }

                this.selectedFiles = [];
                this.ea.publish('uploadSupplierProductFileDone',  <SupplierProductFile> result);
                this.isUploading = false; 
            
                ( <any> document.getElementById("files")).value = "";

            }).catch( e => {
                this.selectedFiles = [];
                this.nService.error(e);
                this.isUploading = false;
            });
    }
 
}