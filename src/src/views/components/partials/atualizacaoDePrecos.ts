import { SupplierProductFileRow } from '../../../domain/supplierProductFileRow';
import { SupplierProductFile } from '../../../domain/supplierProductFile';
import { Config } from 'aurelia-api'; 
import { ProductRepository } from '../../../repositories/productRepository';
import { NotificationService } from '../../../services/notificationService';
import { IdentityService } from '../../../services/identityService';
import { ProductCategory } from '../../../domain/productCategory';
import { ProductClass } from '../../../domain/productClass';
import { autoinject } from 'aurelia-framework'; 
import { EventAggregator } from 'aurelia-event-aggregator'; 
import { SupplierProductStatus } from '../../../domain/supplierProductStatus';
import { PriceListRepository } from '../../../repositories/priceListRepository';
import { PriceList } from '../../../domain/priceList';
import { PriceListItem } from '../../../domain/priceListItem';

@autoinject
export class AtualizacaoDePrecos{ 

    supplierProducts    : PriceListItem[]; 
    filteredProducts    : PriceListItem[]; 
    alteredProducts     : PriceListItem[]; 
    classes             : ProductClass[];
    categories          : ProductCategory[];
    priceLists          : PriceList[];

    selectedFiles       : any; 
    isUploading         : boolean;
    selectedPriceList   : PriceList;
    selectedClass       : ProductClass;
    selectedCategory    : ProductCategory;
    filter              : string;
    isLoading           : boolean;

    constructor(		
		private service             : IdentityService,
		private nService            : NotificationService, 
        private ea                  : EventAggregator ,
        private productRepository  : ProductRepository,
        private priceListRepository : PriceListRepository,
        private config              : Config,
        private repository          : ProductRepository) { 

            this.filteredProducts   = [];
            this.supplierProducts   = [];
            this.alteredProducts    = [];
            this.isLoading          = true; 
    } 

    attached(){
        this.ea.subscribe('productAdded', () => this.loadData(true));
        this.ea.subscribe('productFileUploaded', () => this.loadData(true));
        this.loadData(true); 
    }

    loadData(loadProducts : boolean){

        
        this.isLoading          = true; 

        var promissePriceList = this.priceListRepository
                                    .getAll()
                                    .then(priceLists => {
                                        
                                        if(priceLists.length > 0){

                                            this.priceLists = priceLists;
                                            if(this.selectedPriceList == null){
                                                this.selectedPriceList = priceLists[0];
                                            } 
                                        }
                                    });

        var promisseProducts = this.productRepository
                                    .getProductClassesBySelectedProducts()
                                    .then( (classes : ProductClass[]) => {   
                                        
                                        this.classes = classes; 
                                        if(this.selectedClass == null){
                                            this.selectedClass = classes[0];
                                        }
                                        
                                        /* if(this.selectedCategory != null &&  classes.length > 0) {
                                            var selectedCtg = this.selectedCategory;
                                            var classesFiltered = classes.filter( (x : ProductClass) => x.id == this.selectedClass.id);

                                            if(classesFiltered.length > 0){

                                                    this.selectedClass = classesFiltered[0];
                                                    var filteredCategory = this.selectedClass.categories.filter( (x : ProductCategory) => x.id == selectedCtg.id);
                                                    if(filteredCategory.length > 0){
                                                        this.selectedCategory = filteredCategory[0];
                                                    }
                                                }
                                        } */
                                        this.ea.publish('atualizacaoDePrecosLoaded');
                                    }).catch( e => {
                                    // this.nService.presentError(e);
                                    });

        Promise.all([promissePriceList, promisseProducts]) 
               .then( () => {
                    if(loadProducts){
                        this.loadProducts();
                    }
                    else{
                        this.isLoading = false;
                    }
               });
    } 

    updateClass(){
        this.selectedClass = this.classes[0];
        this.loadProducts();
    }

    loadProducts() : Promise<any>{

        this.isLoading = true; 
        this.supplierProducts = [];
        this.filteredProducts = []; 
        this.alteredProducts = [];  
        
        if(this.selectedPriceList != null && this.selectedClass != null){
            
            return this.repository
                        .getAllSuplierProducts(this.selectedPriceList.id, this.selectedClass.id)
                        .then( (data : PriceListItem[]) => {
                            this.supplierProducts = data;
                            this.filteredProducts = data; 
                            this.search(); 
                            this.isLoading = false; 

                        }).catch( e => {
                            this.nService.presentError(e); 
                            this.isLoading = false; 
                        });
        }
    }

    search(){ 

        this.filteredProducts = this.supplierProducts.filter( (x : PriceListItem) => {

            var isFound = true;  

                if( this.selectedCategory != null && this.selectedCategory.id != '' && ( <any> this.selectedCategory) != '-1'){ 

                    if(x.supplierProduct.product.base.category.id == this.selectedCategory.id){
                        isFound = true;
                    }
                    else {
                        isFound= false;
                    }
                }
                if(isFound){

                    if( (this.filter != null && this.filter != '')){ 
                        if( 
                                 x.supplierProduct.product.base.name.toUpperCase().includes(this.filter.toUpperCase()) 
                            ||  (x.supplierProduct.clientCode != null && x.supplierProduct.clientCode.toUpperCase().includes(this.filter.toUpperCase()))
                            ||  (x.supplierProduct.product.description != null && x.supplierProduct.product.description.toUpperCase().includes(this.filter.toUpperCase())) 
                            ||  (x.supplierProduct.product.brand != null && x.supplierProduct.product.brand.name != null && x.supplierProduct.product.brand.name.toUpperCase().includes(this.filter.toUpperCase())) 
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

    edit(item : PriceListItem){
        ( <any> item).isEditing = true;
        ( <any> item).oldPrice  = item.price;
        ( <any> item).oldStatus  = item.supplierProduct.status;
    }

    cancelEdit(item : PriceListItem){
        ( <any> item).isEditing = false;
        ( <any> item).walAltered = false;
        item.price  = ( <any> item).oldPrice;
        item.supplierProduct.status  = ( <any> item).oldStatus;

        this.alteredProducts = this.alteredProducts.filter(x => x.id != item.id);
    }

    alterStatus(item : PriceListItem, status : SupplierProductStatus){
        item.supplierProduct.status = status; 
    }

    save(item : PriceListItem){

        this.alteredProducts.push(item);
        ( <any> item).isEditing = false;
        ( <any> item).wasAltered = true;
        ( <any> item).isLoading = true;

        this.repository
            .alterSuplierProduct(this.alteredProducts, this.selectedPriceList.id)
            .then( () => {    

                this.alteredProducts = [];
                this.nService.success('O produto foi atualizado com sucesso!');  
                this.ea.publish('uploadSupplierProductFileDone');

                this.isLoading = false;
                ( <any> item).isLoading = false;

                if(item.supplierProduct.status == SupplierProductStatus.Removed){ 
                    this.filteredProducts = this.filteredProducts.filter( x => x != item);
                    this.supplierProducts = this.supplierProducts.filter( x => x != item);
                    this.ea.publish('supplierProductRemoved', item.supplierProduct);
                }

            })
            .catch( e => {
                this.nService.error(e);
                this.isLoading = false;
                ( <any> item).isLoading = false;
                this.alteredProducts = [];
            });

    }

    downloadFile(){ 
        var userId = this.service.getIdentity().id
        var api = this.config.getEndpoint('apiAddress');
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
                ( <any> document.getElementById("files")).value = "";
            });
    }
 
}