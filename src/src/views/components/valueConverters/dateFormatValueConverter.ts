import * as moment from 'moment';

export class DateFormatValueConverter {
 
 

  toView(value) {  
    moment.locale('pt-BR');

    if(value == null || value == '')
      return null;
    return moment(value).format("DD/MM/YYYY");
  }

  fromView(value) {

    moment.locale('pt-BR');    
    
    if(value == null || value == '')
        return null;

    return moment(value, 'DD/MM/YYYY').utc().format("YYYY-MM-DD HH:mm:ssZ");
  }
}