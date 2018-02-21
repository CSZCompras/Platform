import { autoinject, customAttribute } from 'aurelia-framework';
import 'jquery-mask-plugin';

@customAttribute('cell-phone-with-ddd')
@autoinject
export class CellPhoneWithDDDMask{

	constructor(private element: Element) {

	}

    attached(){
       
        $(this.element).mask('(00) 00000-0000'); 
    }
}