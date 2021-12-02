import { autoinject, bindable, bindingMode } from 'aurelia-framework';
import { containerless } from 'aurelia-templating';

@containerless
@autoinject
export class TimeInput {

    @bindable({ defaultBindingMode: bindingMode.twoWay }) timeValue: number;

    @bindable isValid: boolean = true;
    @bindable disabled: boolean = false;

    @bindable blur;

    onBlur() {
        if (this.blur) {
            this.blur();
        }
    }
}