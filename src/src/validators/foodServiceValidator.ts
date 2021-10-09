import { ContactValidator } from './contactValidator';
import { AddressValidator } from './addressValidator';
import { FoodService } from '../domain/foodService';

export class FoodServiceValidator {

    errorMessages: Array<string>;
    isNameInvalid: boolean;
    isInscricaoEstadualInvalid: boolean;
    addressValidator: AddressValidator;
    contactValidator: ContactValidator;

    constructor(private foodService: FoodService) {
        this.errorMessages = new Array<string>();

        if (this.foodService != null && this.foodService.address != null) {
            this.addressValidator = new AddressValidator(this.foodService.address);
        }

        if (this.foodService != null && this.foodService.contact != null) {
            this.contactValidator = new ContactValidator(this.foodService.contact);
        }
        this.validate();
    }


    validate(): Array<string> {
        this.errorMessages = [];

        if (this.addressValidator) {
            this.addressValidator
                .validate()
                .forEach((x: string) => {
                    this.errorMessages.push(x);
                });
        }

        if (this.contactValidator) {
            this.contactValidator
                .validate()
                .forEach((x: string) => {
                    this.errorMessages.push(x);
                });
        }

        this.validateName();
        this.validateInscricaoEstadual();
        return this.errorMessages;
    }

    validateName() {
        if (this.foodService.name == null || this.foodService.name.length == 0) {
            this.errorMessages.push('O nome do fornecedor é obrigatório');
            this.isNameInvalid = true;
        }
        else {
            this.isNameInvalid = false;
        }
    }

    validateInscricaoEstadual() {

        if (this.foodService.inscricaoEstadual == null || this.foodService.inscricaoEstadual == '') {
            this.errorMessages.push('A inscrição estadual é obrigatória');
            this.isInscricaoEstadualInvalid = true;
        }
        else {
            this.isInscricaoEstadualInvalid = false;
        }
    }
}