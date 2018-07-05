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

        filteredFoodServices : FoodServiceConnectionViewModel[];
        foodServices : FoodServiceConnectionViewModel[];                
        selectedCategory : string;
        title : string;
        type : number;
        filter : string;

        constructor(
                private router: Router,  
                private repository : FoodServiceConnectionRepository, 
                private nService : NotificationService, 
                private ea : EventAggregator) {   
                
                this.ea.subscribe( 'RegistrationSent', () =>{
                        this.loadData();
                });
        }
        
        attached(){

                this.ea.publish('loadingData'); 
                this.type = 0;      
                this.alterView(this.type).then( () => this.ea.publish('dataLoaded'));        
        }

        loadData() : void {

            this.loadSuppliers().then( () => this.ea.publish('dataLoaded')); 
        }

        alterView(type : number) : Promise<any>{
                
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

                return  this.loadSuppliers();
        }

        loadSuppliers() : Promise<any> {

                return this.repository
                                .getSuppliers(this.type)
                                .then( (data : FoodServiceConnectionViewModel[]) =>{
                                        this.foodServices = data;
                                        this.search();
                                
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
                                this.loadData();
                                this.nService.presentSuccess('Cliente foi aprovado com sucesso!');
                                this.ea.publish('foodApproved');
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
                                this.ea.publish('registrationSent');
                        }).catch( e => {
                            this.nService.presentError(e);
                        });

        }

        reject(x : FoodServiceSupplier){

                var viewModel = new FoodServiceConnectionViewModel();
                viewModel.foodService = x.foodService;                
                viewModel.status = 3;

                this.repository
                        .updateConnection(viewModel)
                        .then( (data : any) =>{
                                this.loadData();
                                this.nService.presentSuccess('Status rejeitado com sucesso!');
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
                                this.loadData();
                                this.nService.presentSuccess('Status bloqueado com sucesso!');
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

                                this.loadData();
                                this.nService.presentSuccess('Status desbloqueado com sucesso!');
                        }).catch( e => {
                            this.nService.presentError(e);
                        });

        }

        search(){ 

                this.filteredFoodServices = 
                        this.foodServices.filter( (x : FoodServiceConnectionViewModel) =>{

                                var isFound = true;

                                if( (this.filter != null && this.filter != '')){ 
                                        if( x.foodService.name.toUpperCase().includes(this.filter.toUpperCase()) ){
                                                isFound = true;
                                        }
                                        else {
                                                isFound= false;
                                        }
                                }
                                else{
                                        return isFound;
                                }
                                return isFound;
                        });
        }

}