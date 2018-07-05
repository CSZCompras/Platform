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

@autoinject
export class Pedido{

    $               : any;
	currentStep     : number;
	totalSteps      : number;
    lists           : BuyList[];
    buyList         : BuyList ;
    isProcessing    : boolean;
	simulation      : Simulation;
	input 			: SimulationInput;
	selectedResult 	: SimulationResult;	
    
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
		this.input = new SimulationInput();
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

	advance(){   

        this.currentStep++;

        if(this.currentStep == 2){
            this.simulate();
        }
    }
    
    simulate(){

		this.ea.publish('loadingData'); 

		this.isProcessing = true;
		
		this.input.buyListId = this.buyList.id;

		this.buyList.products.forEach( (x : BuyListProduct) =>{
			
			if(x.isInList){
				var item = new SimulationInputItem();

				item.productId = x.foodServiceProduct.product.id;
				item.quantity = (<any> x.foodServiceProduct.product).quantity;		
				
				if(item.quantity > 0){
					this.input.items.push(item);
				}
			}
		});		

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

    loadData(){

        this.repository
            .getLists()
			.then(x =>  this.lists = x)
			.then(x =>{
				
				this.lists.forEach(x => {
					x.products.forEach( y =>{ (<any> y.foodServiceProduct.product).quantity = 5000; });
				});
			})
			.then( () => this.ea.publish('dataLoaded'))
            .catch( e =>  this.nService.presentError(e));
	}
	
	generateOrder(){

		this.ea.publish('loadingData'); 

		this.orderRepository
			.createOrder(this.selectedResult)
			.then( (result : any) =>{         
				this.nService.success('Pedido realizado!');
				this.router.navigate('/#/dashboard');                
				this.ea.publish('dataLoaded');
			}).catch( e => {
				this.ea.publish('dataLoaded');
				this.nService.error(e);
			});
	}

	changeSelectedCotacao(result : SimulationResult){
		
		this.simulation.betterResults.forEach(x => x != result ? x.isSelected = false : x.isSelected = true );
		this.selectedResult = result;

	}
}