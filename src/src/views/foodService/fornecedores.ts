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
                private nService : NotificationService,
                private ea : EventAggregator) {              
                
                this.ea.subscribe( 'WaitingToApprove', () =>{
                        this.loadData();
                });
                
                this.ea.subscribe( 'RegistrationApproved', () =>{
                        this.loadData();
                });

                this.ea.subscribe( 'RegistrationRejected', () =>{
                        this.loadData();
                });                
                
                this.ea.subscribe( 'ClientBlocked', () =>{
                        this.loadData();
                });
                
                this.ea.subscribe( 'WaitingToApprove', () =>{
                        this.loadData();
                });
        }
        
        attached(){

                this.ea.publish('loadingData'); 
                this.loadData();
                this.alterView(2);
        }

        loadData() : void {
                
               if(this.type == null || this.type == 0){
                       this.type = 2;
               }
               
               this.alterView(this.type).then( () => this.ea.publish('dataLoaded'))
        }

        alterView(type : number) : Promise<any> {
                
                this.type = type;

                if(type == 1){
                        this.title = 'Fornecedores Sugeridos';
                        return this.loadSuggestedSuppliers();
                }
                else if(type == 2){
                        this.title = 'Meus fornecedores';
                        return this.loadMySuppliers();
                }                
                else if(type == 3){
                        this.title = 'Todos fornecedores';
                        return this.loadAllSuppliers();
                }
        }

        loadSuggestedSuppliers() : Promise<any>{

                return this.repository
                        .getSuggestedSuppliers()
                        .then( (data : SupplierViewModel[]) =>{
                                this.suppliers = data;
                                this.search();
                        });
        }

        loadMySuppliers() : Promise<any>{

                return this.repository
                        .getMySuppliers()
                        .then( (data : SupplierViewModel[]) =>{
                                this.suppliers = data;
                                this.filteredSuppliers = data;
                        });
        }

        loadAllSuppliers() : Promise<any>{

                return this.repository
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