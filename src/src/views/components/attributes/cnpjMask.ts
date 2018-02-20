import { autoinject, customAttribute } from 'aurelia-framework';
import 'jquery-mask-plugin';

@customAttribute('cnpj')
@autoinject
export class CNPJMask{

	constructor(private element: Element) {
        
	}

    attached(){ 
        $(this.element).mask('00.000.000/0000-00'); 
    }
}