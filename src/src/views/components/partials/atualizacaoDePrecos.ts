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

@autoinject
export class AtualizacaoDePrecos{ 
    supplierProducts  : Array<SupplierProduct>; 
    selectedFiles : any; 
    isUploading : boolean;
    
    constructor(		
        private router: Router, 
		private service : IdentityService,
		private nService : NotificationService, 
        private ea : EventAggregator ,
        private config: Config,
        private repository : ProductRepository) { 
            this.supplierProducts = new Array<SupplierProduct>();
    } 

    attached(){

        this.loadData(); 

        this.ea.subscribe('productAdded', (product : SupplierProduct) =>{
            
            
            this.supplierProducts.push(product);
                       
            this.supplierProducts = this.supplierProducts.sort( (a : SupplierProduct, b : SupplierProduct) => 0 - (a.product.name > b.product.name ? -1 : 1));
        }) 
    }

    loadData(){

        this.repository
            .getAllSuplierProducts()
            .then( (data : SupplierProduct[]) => {
                this.supplierProducts = data;
            }).catch( e => {
                this.nService.presentError(e);
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

        this.repository
            .alterSuplierProduct(product)
            .then( (result : any) =>{    
                ( <any> product).isEditing = false;
                ( <any> product).wasAltered = true;
                this.nService.success('O produto foi atualizado com sucesso!');
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
            }).catch( e => {
                this.selectedFiles = [];
                this.nService.error(e);
                this.isUploading = false;
            });
    }
 
}