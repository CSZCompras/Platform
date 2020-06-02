import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog'; 
import { ValidationControllerFactory, ValidationController } from 'aurelia-validation'; 
import { CotacaoViewModel } from '../../../domain/cotacaoViewModel';

@autoinject
export class ObservacoesPedido{
 
    controller                              : DialogController;  
    validationController                    : ValidationController;  
    selectedQuote                           : CotacaoViewModel;

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