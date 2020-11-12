import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class GuiaRapido{

    constructor(private router : Router){

    }

    goToCadastro(){
        this.router.navigateToRoute('guiaRapidoFoodServiceCadastro');
    }
}