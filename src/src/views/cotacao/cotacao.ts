import { inject, NewInstance} from 'aurelia-framework';
import { NotificationService } from '../../services/notificationService';
import { Identity } from '../../domain/identity';
import { IdentityService } from '../../services/identityService';
import { FoodService } from '../../domain/foodService';
import { Aurelia, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';
import { FoodServiceRepository } from '../../repositories/foodServiceRepository';
import { BuyList } from '../../domain/buyList';
import { SimulationRepository } from '../../repositories/simulationRepository';
import { Simulation } from '../../domain/simulation';
import { SimulationInput } from '../../domain/simulationInput';
import { BuyListProduct } from '../../domain/buyListProduct';
import { SimulationInputItem } from '../../domain/simulationInputItem';
import { SimulationResult } from '../../domain/simulationResult';
import { OrderRepository } from '../../repositories/orderRepository';
import { EventAggregator } from 'aurelia-event-aggregator';
import { CotacaoViewModel } from '../../domain/cotacaoViewModel';
import { SupplierViewModel } from '../../domain/supplierViewModel';

@autoinject
export class Pedido{

	$               				: any;
	orderId							: string;
	currentStep     				: number;
	totalSteps      				: number;
    quotes          				: CotacaoViewModel[];
    selectedQuote   				: CotacaoViewModel ;
    isProcessing    				: boolean;
	simulation      				: Simulation;
	input 							: SimulationInput;
	selectedResult 					: SimulationResult;	
	supplierBlackList				: SupplierViewModel[];	
	orderWasGenerated				: boolean;
    
    constructor(		
        private router                  : Router, 	
		private repository              : FoodServiceRepository,	
		private ea 						: EventAggregator,
		private simulationRepository    : SimulationRepository,
		private orderRepository    		: OrderRepository,
		private service                 : IdentityService,
		private nService                : NotificationService) {

		this.currentStep = 1;
        this.totalSteps = 3;		
		this.isProcessing = false;
		this.orderWasGenerated = false;
		this.input = new SimulationInput();
		this.supplierBlackList = [];
    } 
 

	runScript() : void{

		var thisForm = '#rootwizard-1';

		var outher = this;

		if( $(thisForm).length) {

			// Prevent page from jumping when +
			$('.pager li a, .pager li span').on('click', function(e){
				e.preventDefault();
			});

			var wizardStagesTotal = $(thisForm + ' .tab-pane').length;
			
			( <any> $)(thisForm).bootstrapWizard({onNext: function(tab, navigation, index) { 

				if(index <= wizardStagesTotal){
					$(thisForm + ' .tab-pane').eq(index).addClass('active');
					$(thisForm + ' .tab-pane').eq(index - 1).removeClass('active');
				}

			}, onPrevious: function(tab, navigation, index) {
				// Note: index is the previous frame not the current one
				if(index !== -1){
					$(thisForm + ' .tab-pane').eq(index).addClass('active');
					$(thisForm + ' .tab-pane').eq(index + 1).removeClass('active');
				}
			}, onTabShow: function(tab, navigation, index) {
				// Update Progress Bar
				var total = navigation.find('li').length;
				var current = index + 1;
				var completionPercentage = (current / total) * 100;

				var progressBar = $(thisForm).closest('.card').find(".card-header .progress-bar");

				progressBar.css({"width": completionPercentage + "%"}).attr("aria-valuenow", completionPercentage);
			}, onTabClick: function(tab, navigation, index){
				return false;
			}});
		}
	}

	

    activate(params){  

        if(params.orderId != null && params.orderId != ''){

			this.orderId = params.orderId;	
        }
    }

	advance(){   

        this.currentStep++;

        if(this.currentStep == 2){
            this.simulate();
		}

		if(this.currentStep == 3){
			window.scrollTo(0, 0);
		}
    }
    
    simulate(){

		this.ea.publish('loadingData'); 

		this.isProcessing = true; 
		
		this.input.buyListId = this.selectedQuote.id;

		this.input.items = [];

		this.selectedQuote.products.forEach( (x) =>{
			
			if(x.quantity != null && x.quantity != 0){

				var item = new SimulationInputItem();
				item.productId = x.id;
				item.quantity = x.quantity;
				this.input.items.push(item);
			}
		});		

		this.input.supplierBlackList = this.supplierBlackList;

        this.simulationRepository
            .simulate(this.input)
            .then(  x => { 
                
                this.simulation = x;
				this.isProcessing = false;
				this.runScript();
				this.ea.publish('dataLoaded');
            })
            .catch( e => {
                this.nService.presentError(e);
				this.isProcessing = false;
				this.ea.publish('dataLoaded');
            });
    }

	back(){
		this.currentStep--;
	}

    attached() : void {		 

		this.ea.publish('loadingData'); 

		this.runScript();
		this.loadData(); 
	}  

	addRemoveSupplier (supplier : SupplierViewModel){ 

		if(( <any> supplier).wasRemoved){

			this.selectedQuote.suppliers.forEach(x => {
				
				if( x.id  == supplier.id){

					( <any> x).wasRemoved = false;
				}
			});

			this.selectedQuote.products.forEach(x => {

				x.suppliers.forEach(y =>{

					if( y.id  == supplier.id){

						( <any> y).wasRemoved = false;
					}
				});
			});

			this.supplierBlackList = this.supplierBlackList.filter(x => x.id != supplier.id);
		}
		else{ 

			this.selectedQuote.suppliers.forEach(x => {
				
				if( x.id  == supplier.id){

					( <any> x).wasRemoved = true;
				}
			});


			this.selectedQuote.products.forEach(x => {

				x.suppliers.forEach(y =>{

					if( y.id  == supplier.id){

						( <any> y).wasRemoved = true;
					}
				});
			});

			this.supplierBlackList.push(supplier);
		}
	}

    loadData(){

		if(this.orderId != null && this.orderId != ''){

			this.simulationRepository
				.getCotacaoFromOrder(this.orderId)
				.then(x =>  {
					this.selectedQuote = x;

					if(x.blackListSupplier != null){

						this.addRemoveSupplier(x.blackListSupplier);
					}					
				}) 
				.then( () => this.ea.publish('dataLoaded'))
				.catch( e =>  this.nService.presentError(e));

		}
		else{

			this.repository
				.getBuyListsParaCotacao()
				.then(x =>  {
					this.quotes = x;
				}) 
				.then( () => this.ea.publish('dataLoaded'))
				.catch( e =>  this.nService.presentError(e));

		}
	}
	
	generateOrder(){

		this.isProcessing = true;

		this.orderRepository
			.createOrder(this.selectedResult)
			.then( (result : any) =>{         

				this.nService.success('Pedido realizado!');
				this.router.navigateToRoute('pedidosFoodService');
				this.isProcessing = false;
				this.orderWasGenerated = true;
			}).catch( e => {
				
				this.isProcessing = false;
				this.nService.error(e);
			});
	}

	changeSelectedCotacao(result : SimulationResult){
		
		this.simulation.betterResults.forEach(x => x != result ? x.isSelected = false : x.isSelected = true );
		this.selectedResult = result;

	}
}