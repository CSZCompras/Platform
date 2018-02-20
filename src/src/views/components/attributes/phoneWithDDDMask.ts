import { autoinject, customAttribute } from 'aurelia-framework';
import 'jquery-mask-plugin';

@customAttribute('phone-with-ddd')
@autoinject
export class PhoneWithDDDMask{

	constructor(private element: Element) {

	}

    attached(){
       
        $(this.element).mask('(00) 0000-0000'); 
    }
}