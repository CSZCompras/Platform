import * as moment from 'moment';

export class DateAndTimeFormatValueConverter {
 
 

  toView(value) {  
    moment.locale('pt-BR');

    if(value == null || value == '')
      return '';
    return moment(value).format("DD/MM/YYYY HH:mm:ss");
  }

  fromView(value) {
    moment.locale('pt-BR');    

    return moment(value, 'DD/MM/YYYY').utc().format("YYYY-MM-DD HH:mm:ssZ");
  }
}