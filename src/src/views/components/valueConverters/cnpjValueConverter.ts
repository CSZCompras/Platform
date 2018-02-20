import 'jquery-mask-plugin';


export class CnpjValueConverter{


    toView(value) { 

        if(value != null){

            value = '' + value;
            
            var a = value.substr(0,2);
            var b = value.substr(2,3);
            var c = value.substr(5,3);            
            var d = value.substr(8,4);
            var e = value.substr(12,2);

            return a + '.' + b + '.' + c + '/' + d + '-' + e;
        }
        return value;
    }

    fromView(value) { 
        
        if(value != null)
            return value.replace('.','').replace('.','').replace('/','').replace('-','');

        return null;
    }
}