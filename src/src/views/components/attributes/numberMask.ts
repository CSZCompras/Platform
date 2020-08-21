import { autoinject, customAttribute } from 'aurelia-framework';
import 'jquery-mask-plugin';

@customAttribute('number')
@autoinject
export class NumberMask{

	constructor(private element: Element) {
        
	}

    attached(){ 
        $(this.element).mask('0000');
    }
}