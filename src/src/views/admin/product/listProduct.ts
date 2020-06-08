import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { NotificationService } from '../../../services/notificationService';
import { ProductRepository } from '../../../repositories/productRepository';
import { Product } from '../../../domain/product';
import { ProductCategory } from '../../../domain/productCategory';
import { UnitOfMeasurementRepository } from '../../../repositories/unitOfMeasurementRepository';
import { UnitOfMeasurement } from '../../../domain/unitOfMeasurement';
import { ProductClass } from '../../../domain/productClass';
import { ValidationControllerFactory, ValidationController, validateTrigger, ValidationRules, ControllerValidateResult } from 'aurelia-validation';
import { FormValidationRenderer } from '../../formValidationRenderer';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';

@autoinject
export class ListProduct{

    products                    : Product[];
    filteredProducts            : Product[];
    classes                     : ProductClass[];
    categories                  : ProductCategory[];
    units                       : UnitOfMeasurement[];
    selectedCategory            : ProductCategory;
    selectedClass               : ProductClass;
    selectedClassProduct        : ProductClass;
    selectedCategoryProduct     : ProductCategory;
    filter                      : string;
    isEditing                   : boolean;
    product                     : Product;
    selectedUnit                : UnitOfMeasurement;
    isLoading                   : boolean;
	validationController        : ValidationController;

    constructor(		 
		private ea                          : EventAggregator, 
        private nService                    : NotificationService,
        private repository                  : ProductRepository ,
        private unitRepository              : UnitOfMeasurementRepository,
        private productRepository           : ProductRepository, 
        private validationControllerFactory : ValidationControllerFactory){
            
            
            this.product = new Product();

            this.units = [];// Validation.
            this.validationController = this.validationControllerFactory.createForCurrentScope();
            this.validationController.addRenderer(new FormValidationRenderer());
            this.validationController.validateTrigger = validateTrigger.blur;
    } 

    attached(){
        this.ea.publish('loadingData'); 
        this.loadData();
    }

    activate(){ 


     /*   ValidationRules 
            .ensure((p : Product) => p.base.name).displayName('Nome do produto').required() 
            .ensure((p : Product) => p.base.category).displayName('Categoria do produto').required() 
            .on(this.product);  */ 
    }

    loadData(){
         

        this.productRepository
               .getAllClasses()
               .then( (data : ProductClass[]) => { 
                   this.classes = data;
                   this.categories = data[0].categories;
                   this.selectedCategory = this.categories[0];
                   this.searchProducts();
                   this.ea.publish('dataLoaded');
               }).catch( e => {
                   this.nService.presentError(e);
               });

        this.unitRepository
            .getAll()
            .then( (data : UnitOfMeasurement[]) => { 
                this.units = data;
            }).catch( e => {
                this.nService.presentError(e);
            });
    }

    updateCategories(){
        this.categories = this.selectedClass.categories;
        this.selectedCategory = this.categories[0];
        this.searchProducts();
        this.products = [];
        this.filteredProducts = [];
    }

    searchProducts() {  

        if(this.selectedCategory != null){
        
            this.isLoading = true;

            this.repository
                .getAllProductsByCategory(this.selectedCategory.id)
                .then(x => {
                    this.products = x;
                    this.filteredProducts = x;
                    this.isLoading = false;
                    this.search(); 
                })
                .catch( e => {
                    this.nService.presentError(e);
                    this.isLoading = false;
                }); 
        }
        else{
            this.products = [];
            this.filteredProducts = [];
        }

    }

    search(){

        this.filteredProducts = this.products.filter( (x :Product) =>{

            var isFound = true; 

                if( (this.selectedCategory != null && this.selectedCategory.id != '')){ 
                    if(x.base.category.id == this.selectedCategory.id){
                        isFound = true;
                    }
                    else {
                        isFound= false;
                    }
                }
           

                if(isFound){

                    if( (this.filter != null && this.filter != '')){ 
                        if( 
                                x.base.name.toUpperCase().includes(this.filter.toUpperCase()) 
                            ||  x.base.category.name.toUpperCase().includes(this.filter.toUpperCase()) 
                            ||  x.brand != null && x.brand.name.toUpperCase().includes(this.filter.toUpperCase()) ){
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
 
    edit(product : Product){

        this.isEditing = true;
        this.product = product;

        this.selectedClassProduct = this.classes.filter(x => x.id == product.base.category.productClass.id)[0];
        this.categories = this.selectedClassProduct.categories;
        this.product.base.category = this.categories.filter( x => x.id == this.product.base.category.id)[0];
        this.product.unit = this.units.filter( x => x.id == this.product.unit.id)[0];
    }

    create(){

        this.product = new Product();
        this.isEditing = true;
        this.product.isActive = true;
    }

    cancel(){

        this.isEditing = false;
        this.product = null;
    }

    addOrUpdate(){

        this.validationController
            .validate()
            .then((result: ControllerValidateResult) => { 
            
                if (result.valid) {   

                    this.isLoading = true;

                    this.repository
                        .addOrUpdate(this.product)
                        .then(x => {               

                            this.product = null;
                            this.searchProducts();
                            this.isEditing = false;
                            this.isLoading = false;
                            this.nService.success('Produto cadastrado com sucesso!');
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