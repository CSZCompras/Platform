import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class Cadastro{

    constructor(private router : Router){

    }

    back(){ 
        this.router.navigateToRoute('guiaRapido');
    }
}