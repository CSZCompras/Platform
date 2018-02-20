export class PhoneWithDDDValueConverter{

    toView(value) {
        
        if(value != null){
            value = '' + value;
            var ddd = value.substr(0,2);
            var firstPart = value.substr(2,4);
            var lastPart = value.substr(6,4);

            return '(' + ddd + ')' + ' ' + firstPart + '-' + lastPart;
        }
        return value;
    }

    fromView(value) { 
        
        if(value != null)
            return value.replace('(','').replace(')','').replace('-','').replace(' ','');

        return null;
    }
}