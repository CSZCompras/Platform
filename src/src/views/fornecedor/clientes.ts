import { inject, NewInstance} from 'aurelia-framework';
import { NotificationService } from '../../services/notificationService';
import { Identity } from '../../domain/identity';
import { IdentityService } from '../../services/identityService';
import { Aurelia, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SupplierViewModel } from '../../domain/supplierViewModel';
import { FoodService } from '../../domain/foodService';
import { FoodServiceConnectionRepository } from '../../repositories/foodServiceConnectionRepository';
import { FoodServiceConnectionViewModel } from '../../domain/foodServiceViewModel';
import { FoodServiceSupplier } from '../../domain/foodServiceSupplier';

@autoinject
export class Clientes{

        foodServices : FoodServiceConnectionViewModel[];                
        selectedCategory : string;
        title : string;
        type : number;

        constructor(private router: Router,  private repository : FoodServiceConnectionRepository, private nService : NotificationService) {         

             
        }
        
        attached(){
            this.type = 0;      
            this.alterView(this.type);            
        }

        loadData() : void {

            this.loadSuppliers();
                
            /*   this.loadSuggestedSuppliers();

                this. productRepository
                    .getAllCategories()
                    .then( (data : ProductCategory[]) => { 
                        this.categories = data;
                    }).catch( e => {
                        this.nService.presentError(e);
                    });*/
        
        }

        alterView(type : number){
                
                this.type = type;

                if(type == 0){
                        this.title = 'Novos Clientes'; 
                }
                else if(type == 1){
                        this.title = 'Aguardando Aprovação'; 
                }                
                else if(type == 2){
                        this.title = 'Meus  Clientes'; 
                }                
                else if(type == 3){
                        this.title = 'Clientes Bloqueados'; 
                }

                this.loadSuppliers();
        }

        loadSuppliers(){

                this.repository
                        .getSuppliers(this.type)
                        .then( (data : FoodServiceConnectionViewModel[]) =>{
                                this.foodServices = data;
                            
                        }).catch( e => {
                            this.nService.presentError(e);
                        });
        } 

        approve(x : FoodServiceSupplier){

                var viewModel = new FoodServiceConnectionViewModel();
                viewModel.foodService = x.foodService;                
                viewModel.status = 2;

                this.repository
                        .updateConnection(viewModel)
                        .then( (data : any) =>{

                                x.status = viewModel.status;
                                if(this.type == 1){
                                        this.foodServices = this.foodServices.filter( (x : FoodServiceConnectionViewModel) =>{
                                                if(x.foodService.id != x.foodService.id){
                                                        return x;
                                                }
                                        });
                                }
                        }).catch( e => {
                            this.nService.presentError(e);
                        });

        }

        registrationSent(x : FoodServiceSupplier){

                var viewModel = new FoodServiceConnectionViewModel();
                viewModel.foodService = x.foodService;                
                viewModel.status = 5;

                this.repository
                        .updateConnection(viewModel)
                        .then( (data : any) =>{ 
                                this.loadData();
                                this.nService.presentSuccess('Status atualizado com sucesso!');
                        }).catch( e => {
                            this.nService.presentError(e);
                        });

        }

        block(x : FoodServiceSupplier){

                var viewModel = new FoodServiceConnectionViewModel();
                viewModel.foodService = x.foodService;                
                viewModel.status = 4;

                this.repository
                        .updateConnection(viewModel)
                        .then( (data : any) =>{

                                x.status = viewModel.status;
                                if(this.type == 0 || this.type == 2){
                                        this.foodServices = this.foodServices.filter( (x : FoodServiceConnectionViewModel) =>{
                                                if(x.foodService.id != x.foodService.id){
                                                        return x;
                                                }
                                        });
                                }
                        }).catch( e => {
                            this.nService.presentError(e);
                        });

        }

        unblock(x : FoodServiceSupplier){

                var viewModel = new FoodServiceConnectionViewModel();
                viewModel.foodService = x.foodService;                
                viewModel.status = 2;

                this.repository
                        .updateConnection(viewModel)
                        .then( (data : any) =>{

                                x.status = viewModel.status;
                                this.foodServices = this.foodServices.filter( (x : FoodServiceConnectionViewModel) =>{
                                        if(x.foodService.id != x.foodService.id){
                                                return x;
                                        }
                                });
                        }).catch( e => {
                            this.nService.presentError(e);
                        });

        }

}