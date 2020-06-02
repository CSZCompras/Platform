import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import { EventAggregator } from 'aurelia-event-aggregator'; 
import { NotificationService } from '../../../services/notificationService'; 
import { Evaluation } from '../../../domain/evaluation';
import { EvaluationRepository } from '../../../repositories/evaluationRepository';
import { EvaluationStatus } from '../../../domain/evaluationStatus';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';

@autoinject
export class Evaluations{

    evaluations                             : Evaluation[];
    filteredEvaluations                     : Evaluation[];
    selectedStatus                          : number;
    evaluation                              : Evaluation;

    constructor(
        private router              : Router, 
        private ea                  : EventAggregator, 
        private repository          : EvaluationRepository,
        private nService            : NotificationService) { 
    }

    attached(){       
        
        this.ea.publish('loadingData'); 

        this.selectedStatus = 0;
        this.loadData();
    }

    loadData(){

        this.load();
    }

    load(){ 

        this.repository
            .getEvaluations(this.selectedStatus)
            .then(x =>{

                this.evaluations = x;
                this.filteredEvaluations = x;
                this.ea.publish('dataLoaded');
            })
            .catch( e => {
                this.ea.publish('dataLoaded');
                this.nService.presentError(e);
            });
    }

    reject(evaluation : Evaluation){

        (<any> evaluation).processing = true;        

        this.repository
            .updateStatus(evaluation.id, EvaluationStatus.Rejected)
            .then( ()=> {
                evaluation.status = EvaluationStatus.Rejected;
                this.nService.success('Avaliação alterada com sucesso!');
                (<any> evaluation).processing = false;
                this.evaluation = null;
            })
            .catch(e => {
                this.nService.error(e);
                (<any> evaluation).processing = false;
            });
    }
    
    approve(evaluation : Evaluation){

        (<any> evaluation).processing = true;      
        
        this.repository
            .updateStatus(evaluation.id, EvaluationStatus.Approved)
            .then( ()=> {
                evaluation.status = EvaluationStatus.Approved;
                this.nService.success('Avaliação alterada com sucesso!');
                (<any> evaluation).processing = false;
                this.evaluation = null;
            })
            .catch(e => {
                this.nService.error(e);
                (<any> evaluation).processing = false;
            });
    }

    showDetails(evaluation : Evaluation){
        this.evaluation = evaluation;
    }

}