export class TimeValueConverter{


    toView(value) { 

        if(value != null){  
            
            value = value +'';

            if(value.length == 3){
                var a = ('' + value).substr(0,1);
                var b = ('' + value).substr(1,2);  
                return a + ':' + b;
            }
            else{
                var a = ('' + value).substr(0,2);
                var b = ('' + value).substr(2,2);  
                return a + ':' + b;
            }            
        }
        return value;
    }

    fromView(value) { 
        
        value = value.replace(':','');

    /*    if(value.length == 1 && value > 2){
            value *= 100;
        }
        else if(value.length == 2){
            value *= 100;
        }
        else if(value.length == 3){
            value *= 10;
        }*/
        
        if(value != null)
            return (''+ value).replace(":","");

        return null;
    }
}