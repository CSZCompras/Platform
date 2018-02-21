import { Address } from '../domain/address';

export class AddressValidator {

    errorMessages : Array<string>;
    isCepInvalid : boolean;    
    isLogradouroInvalid : boolean;        
    isNumberInvalid : boolean;            
    isNeighborhoodInvalid : boolean;    
    isCityInvalid : boolean;
    isStateInvalid : boolean;

    constructor(private address : Address) {   

        this.errorMessages = new Array<string>();
        this.validate();
    }


    validate() : Array<string>{        
        this.errorMessages = [];
        this.validateCep();
        this.validateLogradouro();    
        this.validateNumber();
        this.validateNeighborhood();    
        this.validateCity();
        this.validateState();
        return this.errorMessages;
    }

    validateCep(){        
        if(this.address.cep == null || this.address.cep.length < 8){
            this.errorMessages.push('O cep do endereço é obrigatório');
            this.isCepInvalid = true;
        }
        else{
            this.isCepInvalid = false;
        }
    } 

    validateLogradouro(){        
        if(this.address.logradouro == null || this.address.logradouro.length < 3){
            this.errorMessages.push('O logradouro do endereço é obrigatório');
            this.isLogradouroInvalid = true;
        }
        else{
            this.isLogradouroInvalid = false;
        }
    } 

    validateNumber(){

        if(this.address.number == null || ( '' + this.address.number) == '' || ( <Number> this.address.number) <= 0){
            this.errorMessages.push('O número do endereço é obrigatório');
            this.isNumberInvalid = true;
        }
        else{
            this.isNumberInvalid = false;
        }
    }

    validateNeighborhood(){      

        if(this.address.neighborhood == null || this.address.neighborhood.length == 0){
            this.errorMessages.push('O bairro do endereço é obrigatório');
            this.isNeighborhoodInvalid = true;
        }
        else{
            this.isNeighborhoodInvalid = false;
        }
    }

    validateCity(){        
        
        if(this.address.city == null || this.address.city.length == 0){
            this.errorMessages.push('A cidade do endereço é obrigatório');
            this.isCityInvalid = true;
        }
        else{
            this.isCityInvalid = false;
        }
    } 

    validateState(){

        if(this.address.state == null || this.address.state.length == 0){
            this.errorMessages.push('O estado do endereço é obrigatório');
            this.isStateInvalid = true;
        }
        else{
            this.isStateInvalid = false;
        }
    }
}