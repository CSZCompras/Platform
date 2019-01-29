import 'jquery-mask-plugin';


export class CepValueConverter {

    toView(value) { 

        if(value != null){

            value = '' + value;            
            var a = value.substr(0,5);
            var b = value.substr(5,3);
            return a + '-' + b;
        }
        return value;
    }

    fromView(value) { 
        
        if(value != null){
            return value.replace('-','');
        }
        return null;
    }
}