export class MoneyValueConverter{


    toView(value) { 

        if(value != null){                       
             var numero = value.toFixed(2).split('.');
            numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
            return numero.join(',');
        }
        return value;
    }

    fromView(value) { 
        
        if(value != null)
            return (value.split(".").join("").replace(",",""))/100;

        return null;
    }
}