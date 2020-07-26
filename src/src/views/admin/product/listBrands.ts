import { Aurelia, autoinject } from 'aurelia-framework';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';
import { EventAggregator } from 'aurelia-event-aggregator';
import { NotificationService } from '../../../services/notificationService'; 
import { ProductCategory } from '../../../domain/productCategory';  
import { ValidationControllerFactory, ValidationController, validateTrigger, ValidationRules, ControllerValidateResult } from 'aurelia-validation';
import { FormValidationRenderer } from '../../formValidationRenderer';
import { Brand } from '../../../domain/brand';
import { BrandRepository } from '../../../repositories/brandRepository';
import { Product } from '../../../domain/product';
import { ProductRepository } from '../../../repositories/productRepository';

@autoinject
export class ListBrands{
 
    brands                      : Brand[];  
    products                    : Product[];
    filter                      : string;
    isEditing                   : boolean;
    brand                       : Brand; 
    isLoading                   : boolean;
	validationController        : ValidationController;

    constructor(		 
		private ea                          : EventAggregator, 
        private nService                    : NotificationService,
        private repository                  : BrandRepository,
        private productRepository           : ProductRepository,
        private validationControllerFactory : ValidationControllerFactory){
            
            
            this.brand = new Brand(); 

            this.validationController = this.validationControllerFactory.createForCurrentScope();
            this.validationController.addRenderer(new FormValidationRenderer());
            this.validationController.validateTrigger = validateTrigger.blur;
            this.validationController.addObject(this.brand);     
    } 

    attached(){
        this.ea.publish('loadingData'); 
        this.loadData();
    }

    activate(){   
        this.applyRules();
    }

    applyRules(){

        ValidationRules 
            .ensure((b : Brand) => b.name).displayName('Nome da marca').required()  
            .on(this.brand);

    }

    loadData(){
         

        this.repository
               .getAllBrands()
               .then( (data : Brand[]) => { 
                   this.brands = data;  
                   this.ea.publish('dataLoaded');
               }).catch( e => {
                   this.nService.presentError(e);
               }); 
    }  

    edit(brand : Brand){

        this.isEditing = true;
        this.brand = brand;
        this.applyRules();
        this.loadProducts();        
    }

    loadProducts(){

        this.productRepository
               .getProductsByBrand(this.brand.id)
               .then( (products : Product[]) => { 
                   this.products = products;  
               }).catch( e => {
                   this.nService.presentError(e);
               }); 
    }

    create(){

        this.brand = new Brand();
        this.brand.isActive = true;
        this.isEditing = true;
        this.applyRules();
    }

    cancel(){ 
        this.isEditing = false; 
        this.loadData();
    }   

    editBrandStatus(){
        this.brand.isActive = ! this.brand.isActive; 
    }


    addOrUpdate(){

        this.validationController
            .validate()
            .then((result: ControllerValidateResult) => { 
            
                if (result.valid) {   

                    this.isLoading = true;

                    this.repository
                        .addOrUpdateBrand(this.brand)
                        .then(x => {               
                            this.loadData();
                            this.brand = null; 
                            this.isEditing = false;
                            this.isLoading = false;
                            this.nService.success('Marca cadastrada com sucesso!');
                        })
                        .catch( e => {
                            this.nService.error(e);
                            this.isLoading = false;
                        }); 
                    }
                    else { 
                        this.nService.error('Erros de validação foram encontrados');
                    }
                });     
    }

}