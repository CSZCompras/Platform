import { SupplierProductFileRow } from '../../../domain/supplierProductFileRow';
import { SupplierProductFile } from '../../../domain/supplierProductFile';
import { Rest, Config } from 'aurelia-api'; 
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
import { PriceList } from '../../../domain/priceList';

@autoinject
export class AtualizacaoDePrecos{ 

    supplierProducts    : Array<SupplierProduct>; 
    filteredProducts    : Array<SupplierProduct>; 
    selectedFiles       : any; 
    isUploading         : boolean;
    categories          : ProductCategory[];
    selectedCategory    : string;
    filter              : string;
    alteredProducts     : Array<SupplierProduct>; 

    constructor(		
        private router              : Router, 
		private service             : IdentityService,
		private nService            : NotificationService, 
        private ea                  : EventAggregator ,
        private  productRepository  : ProductRepository,
        private config              : Config,
        private repository          : ProductRepository) { 

            this.filteredProducts = new Array<SupplierProduct>();
            this.supplierProducts = new Array<SupplierProduct>();
            this.alteredProducts = new Array<SupplierProduct>();
    } 

    attached(){

        this.loadData(); 

        this.ea.subscribe('productAdded', (product : SupplierProduct) =>{
            
            (<any>product).isNew = true;
            this.supplierProducts.push(product);                       
            this.supplierProducts = this.supplierProducts.sort( (a : SupplierProduct, b : SupplierProduct) => 0 - (a.product.name > b.product.name ? -1 : 1));
            this.search();
        }) 
    }

    loadData(){  

        this.productRepository
               .getAllCategories()
               .then( (data : ProductCategory[]) => { 
                   this.categories = data;
               }).catch( e => {
                   this.nService.presentError(e);
               });

        this.repository
            .getAllSuplierProducts()
            .then( (data : SupplierProduct[]) => {
                this.supplierProducts = data;
                this.filteredProducts = data;
            }).catch( e => {
                this.nService.presentError(e);
            });
    } 

    search(){

        this.filteredProducts = this.supplierProducts.filter( (x : SupplierProduct) =>{

            var isFound = true; 

                if( (this.selectedCategory != null && this.selectedCategory != '')){ 
                    if(x.product.category.id == this.selectedCategory){
                        isFound = true;
                    }
                    else {
                        isFound= false;
                    }
                }
           

                if(isFound){

                    if( (this.filter != null && this.filter != '')){ 
                        if( 
                                x.product.name.toUpperCase().includes(this.filter.toUpperCase()) 
                            ||  x.product.category.name.toUpperCase().includes(this.filter.toUpperCase()) 
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
        ( <any> product).oldIsActive  = product.isActive;
    }

    cancelEdit(product : SupplierProduct){
        ( <any> product).isEditing = false;
        ( <any> product).walAltered = false;
        product.price  = ( <any> product).oldPrice;
        product.isActive  = ( <any> product).oldIsActive;

        this.alteredProducts = this.alteredProducts.filter(x => x.id != product.id);
    }

    alterStatus(product : SupplierProduct){
        
        product.isActive = ! product.isActive;
        
        // this.repository
        //     .alterStatusSuplierProduct(product)
        //     .then( (data  : any) => {
        //         this.nService.success('O status do produto foi alterado com sucesso!')
        //     }).catch( e => {
        //         product.isActive = ! product.isActive;
        //         this.nService.presentError(e);
        //     });

    }

    save(product  :SupplierProduct){

        this.alteredProducts.push(product);
                    
        ( <any> product).isEditing = false;
        ( <any> product).wasAltered = true; 
    }

    saveAll(){

        this.repository
            .alterSuplierProduct(this.alteredProducts)
            .then( (result : any) =>{    
                this.nService.success('Os produtos foram atualizados com sucesso!'); 
                this.ea.publish('uploadSupplierProductFileDone');
            }).catch( e => {
                this.nService.error(e);
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
                
                this.loadData();

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