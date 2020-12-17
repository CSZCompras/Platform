import { ValidationRules } from 'aurelia-validation';
import { Address } from './address';
import { StateRegistration } from './stateRegistration';
import { Contact } from "./contact";
import { FoodServiceSupplier } from './foodServiceSupplier';
import { SupplierStatus } from './supplierStatus';
import { RegisterStatus } from './registerStatus';


export class Supplier {

    id                      : string;
    name                    : string;
    fantasyName             : string;
    cnpj                    : string;
    stateRegistration       : StateRegistration;
    address                 : Address;
    contact                 : Contact; 
    inscricaoEstadual       : string;
    foodServiceSuppliers    : FoodServiceSupplier[];
    status                  : SupplierStatus;
    registerStatus          : RegisterStatus;
    fee                     : Number;
    isTrainingAccount       : boolean; 

    constructor() {
         
        
    }
}
