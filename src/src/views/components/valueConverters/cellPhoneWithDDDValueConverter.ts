export class CellPhoneWithDDDValueConverter{

    toView(value) {
        
        if(value != null){
            value = '' + value;
            var ddd = value.substr(0,2);
            var firstPart = value.substr(2,5);
            var lastPart = value.substr(7,4);

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