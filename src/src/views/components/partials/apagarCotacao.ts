import { autoinject } from 'aurelia-framework'; 
import { EventAggregator } from 'aurelia-event-aggregator'; 
import { SimulationMarketInputViewModel } from '../../../domain/simulation/simulationMarketInputViewModel';
import { SimulationRecorded } from '../../../domain/simulation/simulationRecorded';
import { NotificationService } from '../../../services/notificationService'; 
import { SimulationRecordedItem } from '../../../domain/simulation/simulationRecordedItem';
import { ProductBase } from '../../../domain/productBase';
import { SimulationRepository } from '../../../repositories/simulationRepository';
import { ProductClass } from '../../../domain/productClass';
import { DialogController } from 'aurelia-dialog';


@autoinject
export class ApagarCotacao{
 
    simulationRecorded                      : SimulationRecorded; 
    processing                              : boolean;

    constructor(          
        private controller                  : DialogController, 
		private simulationRepository    	: SimulationRepository,
        private ea                          : EventAggregator,
        private notification                : NotificationService){  
        this.simulationRecorded = new SimulationRecorded(); 
        this.processing = false;
    }    

    activate(params){  

        if(params.Simulation != null){
            this.simulationRecorded = params.Simulation;            
        }
    } 

    cancel(){
        this.simulationRecorded.name = (<any> this.simulationRecorded).oldName;
        this.controller.cancel();
    } 

    deleteQuote(){ 
            this.processing = true;
            this.simulationRepository
                .deleteSimulation(this.simulationRecorded)
                .then( (x : any) => {
                    this.processing = false;
                    this.notification.success('Cotação apagada com sucesso!');
                    this.controller.ok();
                })
                .catch( e => {
                    this.processing = false;
                    this.notification.presentError(e); 
                }); 
    }
}