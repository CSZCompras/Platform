import { autoinject, customAttribute } from 'aurelia-framework';
import 'jquery-mask-plugin';

@customAttribute('cep')
@autoinject
export class CEPMask{

	constructor(private element: Element) {
        
	}

    attached(){ 
        $(this.element).mask('00000-000'); 
    }
}