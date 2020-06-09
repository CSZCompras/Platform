import {
    ValidationRenderer,
    RenderInstruction,
    ValidateResult
} from 'aurelia-validation';

export class FormValidationRenderer {

    render(instruction: RenderInstruction) {
 

        for (let { result, elements } of instruction.unrender) {
            if (result.valid || instruction.render.find(x => x.result.valid === false && x.result.propertyName === result.propertyName)) {
                continue;
            }
            for (let element of elements) {
                this.remove(element, result);
            }
        }

        for (let { result, elements } of instruction.render) {
            if (result.valid) {
                continue;
            }
            for (let element of elements) {
                this.add(element, result);
            }
        }
    }

    add(element: Element, result: ValidateResult) {   
        
        const formGroup = element.closest('.form-group');

        if (!formGroup || formGroup.classList.contains('has-danger')) {
            return;
        }

        formGroup.classList.add('has-danger');
        formGroup.firstElementChild.classList.add('text-danger');
        element.classList.add('border-danger');

        this.setAttributes(element, {
            "data-toggle": "popover",
            "data-content": result.message,
            "data-placement": "top",
            "data-trigger": "hover"
        });

        ($(element) as any).popover();
    }

    remove(element: Element, result: ValidateResult) {
        const formGroup = element.closest('.form-group');
        if (!formGroup) {
            return;
        }

        formGroup.classList.remove('has-danger');
        formGroup.firstElementChild.classList.remove('text-danger');
        element.classList.remove('border-danger');

        this.removeAttributes(element, {
            "data-toggle": "popover",
            "data-placement": "top",
            "data-content": result.message,
            "data-trigger": "hover"
        });

        ($(element) as any).popover('dispose');
    }

    setAttributes(element, attrs) {
        for (var key in attrs) {
            element.setAttribute(key, attrs[key]);
        }
    }

    removeAttributes(element, attrs) {
        for (var key in attrs) {
            element.removeAttribute(key, attrs[key]);
        }
    }
}
