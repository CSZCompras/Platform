import { autoinject, customAttribute } from 'aurelia-framework';
import 'jquery-mask-plugin';

@customAttribute('inscricaoEstadual')
@autoinject
export class InscricaoEstadualMask{

	constructor(private element: Element) {
        
	}

    attached(){ 
        $(this.element).mask('000.000.000.000'); 
    }
}