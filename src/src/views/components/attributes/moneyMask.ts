import { autoinject, customAttribute } from 'aurelia-framework';
import 'jquery-mask-plugin';

@customAttribute('money')
@autoinject
export class MoneyMask{

	constructor(private element: Element) {
        
	}

    attached(){ 
        $(this.element).mask('000.000.000.000.000,00', {reverse: true});
    }
}