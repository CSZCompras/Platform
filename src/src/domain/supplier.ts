import { ValidationRules } from 'aurelia-validation';
import { Address } from './address';
import { StateRegistration } from './stateRegistration';
import { Contact } from "./contact";
import { FoodServiceSupplier } from './foodServiceSupplier';


export class Supplier {

    id : string;
    name : string;
    fantasyName : string;
    cnpj : string;
    stateRegistration : StateRegistration;
    address : Address;
    contact : Contact; 
    foodServiceSuppliers : FoodServiceSupplier[];
    
    constructor() {
         
        
    }
}
