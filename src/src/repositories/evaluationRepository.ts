import { Rest, Config } from "aurelia-api";
import { Evaluation } from "../domain/evaluation";
import { EvaluationStatus } from "../domain/evaluationStatus";
import { autoinject } from "aurelia-dependency-injection";


@autoinject
export class EvaluationRepository{
    
    
    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('csz');
    }

    getEvaluations(status : EvaluationStatus) : Promise<Evaluation[]>  {

        return this.api
                    .find('evaluation?status=' + status)
                    .then( (result : Promise<Evaluation[]>) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }

    getMyEvaluations() : Promise<Evaluation[]>  {

        return this.api
                    .find('myEvaluations')
                    .then( (result : Promise<Evaluation[]>) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }

    

    finishOrder(evaluation: Evaluation)  : Promise<any>   {

        return this.api
                   .post('finishOrder', evaluation)
                   .then( (result : any) => {                 
                       return result;
                   })
                   .catch( (e) => {
                       console.log(e);
                       return Promise.resolve(e.json().then( error => {
                           throw error;
                       }));
                   });
    }

    updateStatus(id : string, status : EvaluationStatus)  : Promise<any>   {

        return this.api
                   .post('evaluation', { id : id, status : status })
                   .then( (result : any) => {                 
                       return result;
                   })
                   .catch( (e) => {
                       console.log(e);
                       return Promise.resolve(e.json().then( error => {
                           throw error;
                       }));
                   });
    }
}