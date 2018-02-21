import { ContactValidator } from './contactValidator';
import { AddressValidator } from './addressValidator';
import { Supplier } from '../domain/supplier';

export class SupplierValidator {

    errorMessages : Array<string>;
    isNameInvalid : boolean;    
    addressValidator : AddressValidator;    
    contactValidator : ContactValidator;

    constructor(private supplier : Supplier) {   

        this.errorMessages = new Array<string>();
        this.addressValidator = new AddressValidator(this.supplier.address);
        this.contactValidator = new ContactValidator(this.supplier.contact);
        this.validate();
    }


    validate() : Array<string> {        
        this.errorMessages = [];   

        this.addressValidator
            .validate()     
            .forEach( (x : string) =>{
                this.errorMessages.push(x);
            });            
                    
        this.contactValidator
            .validate()     
            .forEach( (x : string) =>{
                this.errorMessages.push(x);
            });                        

        this.validateName();
        return this.errorMessages;
    }

    validateName(){
        if(this.supplier.name == null || this.supplier.name.length == 0){
            this.errorMessages.push('O nome do fornecedor é obrigatório');
            this.isNameInvalid = true;
        }
        else{
            this.isNameInvalid = false;
        }
    }

}