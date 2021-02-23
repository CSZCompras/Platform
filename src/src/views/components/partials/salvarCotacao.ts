import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog'; 
import { EventAggregator } from 'aurelia-event-aggregator';
import { ValidationControllerFactory, ValidationController  } from 'aurelia-validation'; 
import { SimulationMarketInputViewModel } from '../../../domain/simulation/simulationMarketInputViewModel';
import { SimulationRecorded } from '../../../domain/simulation/simulationRecorded';
import { NotificationService } from '../../../services/notificationService'; 
import { SimulationRecordedItem } from '../../../domain/simulation/simulationRecordedItem';
import { ProductBase } from '../../../domain/productBase';
import { SimulationRepository } from '../../../repositories/simulationRepository';
import { ProductClass } from '../../../domain/productClass';


@autoinject
export class SalvarCotacao{

    simulationMarket                        : SimulationMarketInputViewModel;
    simulationRecorded                      : SimulationRecorded;
    controller                              : DialogController;  
    validationController                    : ValidationController;
    processing                              : boolean;

    constructor(
        pController                         : DialogController, 
        private validationControllerFactory : ValidationControllerFactory,
		private simulationRepository    	: SimulationRepository,
        private ea                          : EventAggregator,
        private notification                : NotificationService){ 
 
        this.controller = pController;   
        this.simulationRecorded = new SimulationRecorded(); 
        this.processing = false;
    }    

    activate(params){  

        if(params.SimulationMarket != null){
            this.simulationMarket = params.SimulationMarket;            
        }  

        if(this.simulationMarket != null && this.simulationMarket.selectedSimulation != null && (<any> this.simulationMarket.selectedSimulation) != ""){
            this.simulationRecorded = this.simulationMarket.selectedSimulation;
            (<any> this.simulationRecorded).oldName = this.simulationRecorded.name;
        }
        else{
            this.simulationRecorded.productClass = new ProductClass();
            this.simulationRecorded.productClass.id = this.simulationMarket.id;
        }

        this.simulationMarket.items.forEach(item => {

            let recordedItem = this.simulationRecorded.items.filter(r => r.productBase.id == item.productBaseId)

            if(recordedItem != null && recordedItem.length > 0){
                recordedItem[0].quantity = item.quantity;
            }
            else{

                let newItem = new SimulationRecordedItem();
                newItem.quantity = item.quantity;
                newItem.productBase = new ProductBase();
                newItem.productBase.id = item.productBaseId;
                this.simulationRecorded.items.push(newItem);
            }
        });
    } 

    cancel(){
        this.simulationRecorded.name = (<any> this.simulationRecorded).oldName;
        this.controller.cancel();
    } 

    saveQuote(){
        
        if(this.simulationRecorded.name != null && this.simulationRecorded.name != ""){
            this.processing = true;
            this.simulationRepository
                .saveSimulation(this.simulationRecorded)
                .then( (x : SimulationRecorded) => {
                    this.processing = false;
                    this.notification.success('Cotação salva com sucesso!');
                    this.controller.ok(x);           
                })
                .catch( e => {
                    this.processing = false;
                    this.notification.presentError(e); 
                });

        }
        else{ 
            this.notification.success('O nome da cotação é obrigatório');
        }
    }
}