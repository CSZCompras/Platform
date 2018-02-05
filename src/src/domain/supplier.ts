import { Address } from './address';
import { StateRegistration } from './stateRegistration';

export class Supplier {

    id : string;
    name : string;
    fantasyName : string;
    cnpj : string;
    stateRegistration : StateRegistration;
    address : Address;
     contact : Contact;
}
