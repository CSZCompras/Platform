import { inject, NewInstance} from 'aurelia-framework';
import { NotificationService } from '../../services/notificationService';
import { Identity } from '../../domain/identity';
import { IdentityService } from '../../services/identityService';
import { Aurelia, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SupplierConnectionRepository } from '../../repositories/supplierConnectionRepository';
import { Supplier } from '../../domain/supplier';
import { ProductRepository } from '../../repositories/productRepository';
import { ProductCategory } from '../../domain/productCategory';
import { FoodServiceSupplier } from '../../domain/foodServiceSupplier';
import { SupplierViewModel } from '../../domain/supplierViewModel';

@autoinject
export class Fornecedores{

        filteredSuppliers : SupplierViewModel[];        
        suppliers : SupplierViewModel[];        
        categories : ProductCategory[];
        selectedCategory : string;
        title : string;
        type : number;
        filter : string;

        constructor(private router: Router, 
                private repository : SupplierConnectionRepository, 
                private  productRepository : ProductRepository, 
                private nService : NotificationService) {                
        }
        
        attached(){

                this.loadData();
                this.alterView(1);
        }

        loadData() : void {
                
               this.loadSuggestedSuppliers();

                this. productRepository
                    .getAllCategories()
                    .then( (data : ProductCategory[]) => { 
                        this.categories = data;
                    }).catch( e => {
                        this.nService.presentError(e);
                    });
        
        }

        alterView(type : number){
                
                this.type = type;

                if(type == 1){
                        this.title = 'Fornecedores Sugeridos';
                        this.loadSuggestedSuppliers();
                }
                else if(type == 2){
                        this.title = 'Meus fornecedores';
                        this.loadMySuppliers();
                }                
                else if(type == 3){
                        this.title = 'Todos fornecedores';
                        this.loadAllSuppliers();
                }
        }

        loadSuggestedSuppliers(){

                this.repository
                        .getSuggestedSuppliers()
                        .then( (data : SupplierViewModel[]) =>{
                                this.suppliers = data;
                                this.filteredSuppliers = data;
                        });
        }

        loadMySuppliers(){

                this.repository
                        .getMySuppliers()
                        .then( (data : SupplierViewModel[]) =>{
                                this.suppliers = data;
                                this.filteredSuppliers = data;
                        });
        }

        loadAllSuppliers(){

                this.repository
                        .getAllSuppliers()
                        .then( (data : SupplierViewModel[]) =>{
                                this.suppliers = data;
                                this.filteredSuppliers = data;
                        });
        }
 
        connect(viewModel : SupplierViewModel){
                this.repository
                        .connect(viewModel.supplier)
                        .then( (connection : FoodServiceSupplier) =>{
                                this.alterView(this.type);
                                this.nService.presentSuccess('A solicitação de conexão foi realizada com sucesso!');
                        }).catch( e => {
                                this.nService.presentError(e);
                        });
        }

        

        search(){ 

                this.filteredSuppliers = 
                        this.suppliers.filter( (x : SupplierViewModel) =>{

                                var isFound = true;

                                if( (this.filter != null && this.filter != '')){ 
                                        

                                        if( x.supplier.name.toUpperCase().includes(this.filter.toUpperCase()) ){
                                                return true;
                                        }
                                        else {
                                                return false;
                                        }
                                }
                                else{
                                         return isFound;
                                }
                                
                        });
        }
}