import toastr = require('toastr');
import { autoinject, Aurelia } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@autoinject
export class NotificationService {
    

    constructor(
        private router: Router,
        private aurelia: Aurelia) {

    }


    notify(){
 
      /*  ( <any> toastr).error('ola'); */
    }
}
