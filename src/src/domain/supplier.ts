import { ValidationRules } from 'aurelia-validation';
import { Address } from './address';
import { StateRegistration } from './stateRegistration';
import { Contact } from "./contact";


export class Supplier {

    id : string;
    name : string;
    fantasyName : string;
    cnpj : string;
    stateRegistration : StateRegistration;
    address : Address;
    contact : Contact; 

    constructor() {
         ValidationRules.ensure( (x : Supplier) => x.cnpj).required().on(this);
        
    }
}
