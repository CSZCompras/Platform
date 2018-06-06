export class TimeValueConverter{


    toView(value) {         

        if(value != null){  

            if(isNaN(value)){
                return '';
            }
            

            value = value +'';

            if(value.length == 3){
                var a = ('' + value).substr(0,1);
                var b = ('' + value).substr(1,2); 

                if(value == ''){
                    return null;
                } 

                if( Number.parseInt(a) > 24){
                    return '';
                }


                if( Number.parseInt(b) > 59 && a.substr(0,1) != "0"){
                    b = '00';
                }

                return a + ':' + b;
            }
            else{
                var a = ('' + value).substr(0,2);
                var b = ('' + value).substr(2,2);  

                if(value == ''){
                    return null;
                }

                if( Number.parseInt(a) > 24){
                    return '';
                } 

                if( Number.parseInt(b) > 59){
                    b = '00';
                }

                return a + ':' + b;
            }            
        }
        return value;
    }

    fromView(value) { 

        
        value = value.replace(':','');


        if(isNaN(value)){
            return '';
        }

        

    /*    if(value.length == 1 && value > 2){
            value *= 100;
        }
        else if(value.length == 2){
            value *= 100;
        }
        else if(value.length == 3){
            value *= 10;
        }*/
        
        if(value != null){ 

            return (''+ value).replace(":","");
        }

        return value == ':' ? '' : value;
    }
}