import {autoinject, customAttribute} from 'aurelia-framework';
import 'jquery-datetimepicker';

@customAttribute('datepicker')
@autoinject
export class DatePicker {
  constructor(private element: Element) {
  }

  attached() {
    ($(this.element) as any).datetimepicker({
      onGenerate:function( ct ){
        /*jQuery(this).find('.xdsoft_date.xdsoft_weekend')
          .addClass('xdsoft_disabled');*/
      },
      format: 'd/m/Y', 
      timepicker:false,
      mask:true,
    })
      .on('blur', e => fireEvent(e.target, 'change'));
  }

  detached() {
    // remove it in here if possible!
  }
}

function fireEvent(element, name) {
  var event = document.createEvent('Event');
  event.initEvent(name, true, true);
  element.dispatchEvent(event);
}