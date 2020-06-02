import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import { EventAggregator } from 'aurelia-event-aggregator'; 
import { NotificationService } from '../../services/notificationService'; 
import { Evaluation } from '../../domain/evaluation';
import { EvaluationRepository } from '../../repositories/evaluationRepository'; 
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
            .getMyEvaluations()
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

    showDetails(evaluation : Evaluation){
        this.evaluation = evaluation;
    }

}