import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';  
import { SimulationInputBaseItem } from '../../../domain/simulation/simulationInputBaseItem'; 
import { BrandViewModel } from '../../../domain/brandViewModel';

@autoinject
export class DetalhesProduto{
 
    controller                              : DialogController;  
    simulationInput                         : SimulationInputBaseItem;
    processing                              : boolean;

    constructor(pController : DialogController){ 

        this.processing = false; 
        this.controller = pController;    
    }    

    activate(params){  

        if(params.SimulationInputBaseItem != null){ 
            this.simulationInput = params.SimulationInputBaseItem; 
            this.simulationInput.brands.forEach(x => x.wasRemoved = false);
            this.simulationInput.units.forEach(x => x.wasRemoved = false);
        }
    }

    addRemoveBrand(brand : BrandViewModel){

        if((<any> brand).wasRemoved == null){
            (<any> brand).wasRemoved = true;
        }
        else{
            (<any> brand).wasRemoved =  ! (<any> brand).wasRemoved;
        }
    }
}