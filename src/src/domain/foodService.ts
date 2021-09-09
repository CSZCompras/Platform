import { Address } from './address';
import { StateRegistration } from './stateRegistration';
import { Contact } from "./contact";
import { FoodServiceSupplier } from './foodServiceSupplier';
import { FoodServiceStatus } from './foodServiceStatus';
import { RegisterStatus } from './registerStatus';

export class FoodService {

    id: string;
    name: string;
    fantasyName: string;
    cnpj: string;
    stateRegistration: StateRegistration;
    address: Address;
    contact: Contact;
    inscricaoEstadual: string;
    status: FoodServiceStatus;
    registerStatus: RegisterStatus;
    foodServiceSuppliers: FoodServiceSupplier[];
    isTrainingAccount: boolean;
    socialContract: any;

    constructor() {
    }
}