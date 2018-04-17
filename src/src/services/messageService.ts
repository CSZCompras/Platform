import { IdentityService } from './identityService';
import { autoinject, Aurelia } from 'aurelia-framework';

@autoinject
export class MessageService{

    
    constructor(private service : IdentityService){
    }
	
	subscribe(){
		
		var ws = new WebSocket(`ws://localhost:49791/hubs/foodServiceSupplierConnection`); 
        var other = this;
        var user = this.service.getIdentity();

		ws.onopen = function () {
				
			ws.send('{ "protocol": "json", "version": 1 }\x1e');

                    console.log('Opened!');
                    
					ws.send(JSON.stringify({
						type: 1,
                        invocationId: user.id,
                        connctionId : user.id,
						target: 'Register',
						arguments: [user.id, user.companyId],
						nonBlocking: false
					})+ "\x1e"); 
            };
			
			ws.onmessage = function (event) {  

				var data : string;
				
				data = (event.data);
				
				data = data.replace('','');

				var msg = JSON.parse(data);

				/*if(msg.type == 1){
					other.nService.presentSuccess('Server: ' + msg.arguments[0].msg);
                }*/
            };
			
			ws.onclose = function (event) {
                console.log('Closed!');
			};  


			ws.onerror = function (event) {
				console.log('Error!');
				console.log(event);
			};  

	} 
}