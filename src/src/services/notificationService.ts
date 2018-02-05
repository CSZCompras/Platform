import toastr = require('toastr');
import { autoinject, Aurelia } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@autoinject
export class NotificationService {
    

    constructor( private router: Router, private aurelia: Aurelia) {            

        toastr.options = {
            closeButton : true,
            showEasing :  'swing',
            hideEasing : 'linear',
            showMethod: 'fadeIn',
            hideMethod: 'fadeOut'
        };

    }

    presentError(error : any) : void{
        if(error.message != null)
            this.error(error.message)
    }

    error(message : string){
        toastr.error(message, 'Erro'); 
    }
}
