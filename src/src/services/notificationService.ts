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
            hideMethod: 'fadeOut',
            positionClass : 'toast-bottom-right',
            extendedTimeOut : 0,
            timeOut : 2000
        };

    }

    error(error : any) : void{
        if(error.message != null){
            if(Array.isArray(error.message)){
                ( <string[]> error.message).forEach( message => this.presentError(message));
            }
            else{
                this.presentError(error.message)            
            }
        }
        else if(Array.isArray(error)){
            ( <any[]> error).forEach( e => this.presentError(e.message));

        }else{
            this.presentError(error);
        }
    }

    success(success : any) : void{
        if(success.message != null)
            this.presentSuccess(success.message)
        else
            this.presentSuccess(success)
    }

    presentError(message : string){
        let options =  { 
            timeOut : 7500
        };
        toastr.error(message, 'Erro', options); 
    }

    presentSuccess(message : string){
        toastr.success(message, 'Sucesso'); 
    }
}
