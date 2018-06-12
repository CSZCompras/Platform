import { autoinject, customAttribute } from 'aurelia-framework';
import 'jquery-mask-plugin';

@autoinject
export class TimeValueConverter{


    toView(value) {         

        if(value != null){  

            debugger;

            if(isNaN(value)){
                return '';
            }
            

            value = value +'';
            

            if(value.length == 1){

                if( Number.parseInt(value) < 10  && Number.parseInt(value) > 2){
                    return '0' + value + ':00';
                }

                if( Number.parseInt(value) <= 2){
                    return value;
                }
                return value + ':00';
            }


            if(value.length == 2){               
                
                
                if( Number.parseInt(value) > 24){

                    return '0'+ value + '0';
                }
                else{

                    return value + ':00';

                }
            }

            if(value.length == 3){
                
                debugger;
                
                var a = ('' + value).substr(0,2);
                var b = ('' + value).substr(2,1); 

                if(value == ''){
                    return null;
                } 

                if( Number.parseInt(a) > 24){

                    var b = ('' + value).substr(1,2);

                    if(Number.parseInt(b) > 59){
                        b  = '00';
                    }
                    return '0' + (value).substr(0,1) +  ':' + b;
                }

                
                if( Number.parseInt(b) > 5){
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

                if( Number.parseInt(a) >= 24){
                    return '';
                }  

                if(b.substr(0, 1) == "0")
                    b = ( ( Number.parseInt(b) * 10) / 10).toString();
 
                if( Number.parseInt(b) > 59){
                    b = '00';
                }

                if(b.length < 2){
                    b += '0';
                }

                return a + ':' + b;
            }            
        } 
    }

    fromView(value) { 

        
    //     value = value.replace(':','');


    //     if(isNaN(value)){
    //         return '';
    //     }

        

    // /*    if(value.length == 1 && value > 2){
    //         value *= 100;
    //     }
    //     else if(value.length == 2){
    //         value *= 100;
    //     }
    //     else if(value.length == 3){
    //         value *= 10;
    //     }*/
        
    //     if(value != null){ 

    //         return (''+ value).replace(":","");
    //     }

    //     return value == ':' ? '' : value;

        return (''+ value).replace(":","");
    }
}