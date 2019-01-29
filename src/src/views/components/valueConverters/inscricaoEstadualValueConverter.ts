import 'jquery-mask-plugin';


export class InscricaoEstadualValueConverter{


    toView(value) { 

        if(value != null){

            value = '' + value;
            
            var a = value.substr(0,3);
            var b = value.substr(3,3);
            var c = value.substr(6,3);            
            var d = value.substr(9,3);

            return a + '.' + b + '.' + c + '.' + d;
        }
        return value;
    }

    fromView(value) { 
        
        if(value != null)
            return value.replace('.','').replace('.','').replace('.','');

        return null;
    }
}