import { NotificationService } from '../../services/notificationService';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FoodServiceConnectionRepository } from '../../repositories/foodServiceConnectionRepository';
import { FoodServiceConnectionViewModel } from '../../domain/foodServiceViewModel'; 
import { DialogService } from 'aurelia-dialog';
import { AprovacaoCliente } from '../components/partials/aprovacaoCliente';
import { RejeicaoCadastroFoodService } from '../components/partials/rejeicaoCadastroFoodService'; 
import { ConnectionStatus } from '../../domain/connectionStatus';


@autoinject
export class Clientes{

        filteredFoodServices    : FoodServiceConnectionViewModel[];
        foodServices            : FoodServiceConnectionViewModel[];                
        selectedCategory        : string;
        title                   : string;
        type                    : number;
        filter                  : string;
        tipoFiltro              : string;
        showDetails             : boolean;
        processing              : boolean;                       

        constructor(  
                private dialogService           : DialogService,
                private repository              : FoodServiceConnectionRepository, 
                private nService                : NotificationService, 
                private ea                      : EventAggregator) {   
                 

                this.ea.subscribe( 'showFoodServiceDetailsCanceled', () =>{
                        this.showDetails = false;  
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                });

                
                this.processing = false;
                this.showDetails = false;
        }
        
        attached(){

                this.ea.publish('loadingData'); 
                this.type = 0;      
                this.tipoFiltro = '0';
                this.alterView().then( () => this.ea.publish('dataLoaded'));        
        }

        loadData() : void {

                this.foodServices = [];
                this.filteredFoodServices = []; 

                this.loadConnections().then( () => this.ea.publish('dataLoaded')); 
        }

        alterView() : Promise<any>{
                
                this.type = Number.parseInt(this.tipoFiltro);

                if(this.type == 0){
                        this.title = 'Novos Clientes'; 
                }
                else if(this.type == 1){
                        this.title = 'Aguardando Aprovação'; 
                }                
                else if(this.type == 2){
                        this.title = 'Meus  Clientes'; 
                }                
                else if(this.type == 3){
                        this.title = 'Clientes Bloqueados'; 
                }     
                
                return  this.loadConnections();
        }

        loadConnections() : Promise<any> {

                this.processing = true;

                return this.repository
                                .getSupplierConnections(this.type)
                                .then( (data : FoodServiceConnectionViewModel[]) =>{
                                        this.foodServices = data;
                                        this.search();
                                        this.processing = false;
                                }).catch( e => {
                                        this.nService.presentError(e);
                                        this.processing = false;
                                });
        } 

        alterConfig(x : FoodServiceConnectionViewModel){ 
                

                var params = { FoodServiceSupplier : x };

                this.dialogService
                        .open({ viewModel: AprovacaoCliente, model: params, lock: false })
                        .whenClosed(response => {

                                if (response.wasCancelled) {
                                        return;
                                }  
                                ( <any> x).isLoading = true;

                                var viewModel = new FoodServiceConnectionViewModel();
                                viewModel.priceListId = response.output.priceList.id;
                                viewModel.paymentTerm = response.output.paymentTerm;
                                viewModel.foodService = x.foodService; 

                                this.repository
                                        .alterConnection(viewModel)
                                        .then( () =>{

                                                x.priceListId =  response.output.priceList.id;
                                                x.priceListName = response.output.priceList.name;
                                                x.paymentTerm = response.output.paymentTerm;
                                                this.nService.presentSuccess('Alteraçao feita com sucesso!');
                                                ( <any> x).isLoading = false;
                                        })
                                        .catch( e => {
                                                this.nService.presentError(e);
                                                ( <any> x).isLoading = false;
                                        });
                        }); 
        }

        approve(x : FoodServiceConnectionViewModel){ 

                var params = { FoodServiceSupplier : x };

                this.dialogService
                        .open({ viewModel: AprovacaoCliente, model: params, lock: false })
                        .whenClosed(response => {

                                if (response.wasCancelled) {
                                        return;
                                }  
                                ( <any> x).isLoading = true;

                                var viewModel = new FoodServiceConnectionViewModel();
                                viewModel.priceListId = response.output.priceList.id;
                                viewModel.paymentTerm = response.output.paymentTerm;
                                viewModel.foodService = x.foodService;                
                                viewModel.status = 2;

                                this.repository
                                        .updateConnection(viewModel)
                                        .then( (data : any) =>{                                
                                                this.foodServices = this.foodServices.filter(fs => fs.foodService.id != x.foodService.id);
                                                this.filteredFoodServices = this.filteredFoodServices.filter(fs => fs.foodService.id != x.foodService.id);
                                                this.nService.presentSuccess('Cliente foi aprovado com sucesso!');
                                                this.ea.publish('foodApproved');
                                                ( <any> x).isLoading = false;
                                        })
                                        .catch( e => {
                                                this.nService.presentError(e);
                                                ( <any> x).isLoading = false;
                                        });
                        }); 
        }

        registrationSent(x : FoodServiceConnectionViewModel){

                ( <any> x).isLoading = true;

                var viewModel = new FoodServiceConnectionViewModel();
                viewModel.foodService = x.foodService;                
                viewModel.status = 5;

                this.repository
                        .updateConnection(viewModel)
                        .then( (data : any) =>{ 
                                
                                ( <any> x).isLoading = true;

                                this.foodServices = this.foodServices.filter(fs => fs.foodService.id != x.foodService.id);
                                this.filteredFoodServices = this.filteredFoodServices.filter(fs => fs.foodService.id != x.foodService.id);                                      
                                this.nService.presentSuccess('Status atualizado com sucesso!');
                                this.ea.publish('registrationSent');
                                ( <any> x).isLoading = false;
                        }).catch( e => {

                            this.nService.presentError(e);
                            ( <any> x).isLoading = false;
                        });

        }

        reject(x : FoodServiceConnectionViewModel){

                var params = { FoodService : x.foodService };

                this.dialogService
                    .open({ viewModel: RejeicaoCadastroFoodService, model: params, lock: false })
                    .whenClosed(response => {

                        if (response.wasCancelled) {
                            return;
                        } 

                        ( <any> x).isLoading = true;

                        var viewModel = new FoodServiceConnectionViewModel();
                        viewModel.foodService = x.foodService;                
                        viewModel.reasonToRejectId = response.output.reason.id;
                        viewModel.status = 3;
        
                        this.repository
                                .updateConnection(viewModel)
                                .then( (data : any) =>{
        
                                        ( <any> x).isLoading = false;
                                        this.foodServices = this.foodServices.filter(fs => fs.foodService.id != x.foodService.id);
                                        this.filteredFoodServices = this.filteredFoodServices.filter(fs => fs.foodService.id != x.foodService.id);
                                        this.nService.presentSuccess('Status rejeitado com sucesso!');
                                        ( <any> x).isLoading = false;
                                })
                                .catch( e => {
        
                                    this.nService.presentError(e);
                                    ( <any> x).isLoading = false;
                                });
                    });  
        }

        block(x : FoodServiceConnectionViewModel){

                ( <any> x).isLoading = true;

                var viewModel = new FoodServiceConnectionViewModel();
                viewModel.foodService = x.foodService;                
                viewModel.status = 4;

                this.repository
                        .updateConnection(viewModel)
                        .then( (data : any) =>{      

                                ( <any> x).isLoading = false;
                                this.foodServices = this.foodServices.filter(fs => fs.foodService.id != x.foodService.id);
                                this.filteredFoodServices = this.filteredFoodServices.filter(fs => fs.foodService.id != x.foodService.id);
                                this.nService.presentSuccess('Status bloqueado com sucesso!');  
                                ( <any> x).isLoading = false;
                        }).catch( e => {

                            this.nService.presentError(e);                                
                            ( <any> x).isLoading = false;
                        });

        }

        unblock(x : FoodServiceConnectionViewModel){

                ( <any> x).isLoading = true;

                var viewModel = new FoodServiceConnectionViewModel();
                viewModel.foodService = x.foodService;                
                viewModel.status = 2;

                this.repository
                        .updateConnection(viewModel)
                        .then( (data : any) =>{    

                                ( <any> x).isLoading = false;
                                this.foodServices = this.foodServices.filter(fs => fs.foodService.id != x.foodService.id);
                                this.filteredFoodServices = this.filteredFoodServices.filter(fs => fs.foodService.id != x.foodService.id);
                                this.nService.presentSuccess('Status desbloqueado com sucesso!');    
                                ( <any> x).isLoading = false;
                        }).catch( e => {
                            this.nService.presentError(e);                           
                            ( <any> x).isLoading = false;
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

        showFoodServiceDetails(x : FoodServiceConnectionViewModel){
                
                this.showDetails = true; 
                let loadConnectionDetails = x.status == ConnectionStatus.Rejected ? true : false;
                this.ea.publish('showFoodServiceDetails', { foodId : x.foodService.id, edit : false ,loadConnection : loadConnectionDetails } );
        }

}