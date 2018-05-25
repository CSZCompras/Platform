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

@autoinject


export class Pedido{

    $               : any;
	currentStep     : number;
	totalSteps      : number;
    lists           : BuyList[];
    buyList         : BuyList ;
    isProcessing    : boolean;
    simulation      : Simulation;
    
    constructor(		
        private router                  : Router, 	
        private repository              : FoodServiceRepository,	
        private simulationRepository    : SimulationRepository,
		private service                 : IdentityService,
		private nService                : NotificationService) {

		this.currentStep = 1;
        this.totalSteps = 3;		
        this.isProcessing = false;
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

        this.isProcessing = true;

        this.simulationRepository
            .simulate(this.buyList.id)
            .then(  x => { 
                
                this.simulation = x;
                this.isProcessing = false;
            })
            .catch( e => {
                this.nService.presentError(e);
                this.isProcessing = false;
            });
    }

	back(){
		this.currentStep--;
	}

    attached() : void {		       
		this.runScript();
		this.loadData(); 
    } 

    loadData(){

        this.repository
            .getLists()
            .then(x => this.lists = x)
            .catch( e =>  this.nService.presentError(e));
    }
}