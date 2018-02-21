import { Contact } from '../domain/contact'; 


export class ContactValidator {

    errorMessages : Array<string>;
    isNameInvalid : boolean;    
    isPhoneInvalid : boolean;        
    isEmailInvalid : boolean;     

    constructor(private contact : Contact) {   

        this.errorMessages = new Array<string>();
        this.validate();
    }


    validate() : Array<string> {                
        this.errorMessages = [];   
        this.validateName();
        this.validatePhone();
        this.validateEmail();
        return this.errorMessages;
    }

    validateName(){

        if(this.contact.name == null || this.contact.name.length == 0){
            this.errorMessages.push('O nome do contato é obrigatório');
            this.isNameInvalid = true;
        }
        else{
            this.isNameInvalid = false;
        }
    }

    validatePhone(){

        if(this.contact.phone == null || ( ''+ this.contact.phone).length < 10){
            this.errorMessages.push('O telefone do contato é obrigatório');
            this.isPhoneInvalid = true;
        }
        else{
            this.isPhoneInvalid = false;
        }
    }

    

    validateEmail(){

        if(this.contact.email == null || this.contact.email.length <= 10){
            this.errorMessages.push('O telefone do contato é obrigatório');
            this.isEmailInvalid = true;
        }
        
        else if(! this.validateEmailString(this.contact.email)){
            this.errorMessages.push('O e-mail digitado é invalido');
            this.isEmailInvalid = true;
        }
        else{
            this.isEmailInvalid = false;
        }
    }

    validateEmailString(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}