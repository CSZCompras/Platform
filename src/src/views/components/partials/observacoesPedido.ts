import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog'; 
import {  ValidationController } from 'aurelia-validation';  
import { SimulationInput } from '../../../domain/simulation/simulationInput';

@autoinject
export class ObservacoesPedido{
 
    controller                              : DialogController;  
    validationController                    : ValidationController;  
    selectedQuote                           : SimulationInput;

    constructor(
        pController                         : DialogController){ 
 
        this.controller = pController;               
    }    

    activate(params){  

        if(params.Quote != null){
            this.selectedQuote = params.Quote;
        } 
       
    }

    confirmOrder(){
        this.controller.ok(this.selectedQuote);
    }
 

    cancel(){
        this.controller.cancel();
    } 
}