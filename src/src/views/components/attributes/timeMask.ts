import { autoinject, customAttribute } from 'aurelia-framework';
import 'jquery-mask-plugin';

@customAttribute('time')
@autoinject
export class TimeMask{

    $ : any;
	constructor(private element: Element) {
        
	}

    attached(){ 
      $(this.element).mask('00:00'); 
        var other = this;
       /* $(this.element).focusout(function() {

            var value = <any>   $(other.element).val();
            if(value.length <= 2){
                value = (value + ':') + '00';
                $(other.element).val(value);
            }
        });*/

    }
}