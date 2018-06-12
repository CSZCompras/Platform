import { IdentityService } from './identityService';
import { autoinject, Aurelia } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Rest, Config } from 'aurelia-api';

@autoinject
export class MessageService{

	api: Rest;

    constructor(private service : IdentityService, 	private ea: EventAggregator, private config: Config){
		this.api = this.config.getEndpoint('csz');
    }
	
	subscribe(){
		
		var address = this.config.getEndpoint('csz').client.baseUrl.replace('https://','').replace('/api/','');

		var ws = new WebSocket('wss://'+ address +'/hubs/foodServiceSupplierConnection'); 
        var other = this;
        var user = this.service.getIdentity();

		ws.onopen = function () {
				
			ws.send('{ "protocol": "json", "version": 1 }\x1e');

                    console.log('Opened!');
                    
					ws.send(JSON.stringify({
						type: 1,
                        invocationId: user.id,
                        xonnectionId : user.id,
						target: 'Register',
						arguments: [ user.id],
						nonBlocking: false
					})+ "\x1e"); 
            };
			
			ws.onmessage = function (event) {  

				var data : string;
				
				data = (event.data);
				
				data = data.replace('','');			

				var msg = JSON.parse(data);

				if( msg.type == 1){					

					other.ea.publish('newNotification', msg.arguments[0]);
				}
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