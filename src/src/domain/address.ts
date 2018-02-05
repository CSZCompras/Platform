import { City } from './city';

export class Address {

    id : string;
    cep : string;
    logradouro : string;
    number : Number;
    neighborhood : string;
    city : City;
    complement : string;
}