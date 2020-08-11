import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import { EventAggregator } from 'aurelia-event-aggregator';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';

@autoinject
export class Produtos {

    productAddedCount             : number;
    selecaoDeProdutosLoaded       : boolean;
    historicoDeImportacaoLoaded   : boolean;c
    atualizacaoDePrecosLoaded     : boolean;

    constructor(private router: Router, private ea : EventAggregator) {
      
      this.productAddedCount = 0;
      this.ea.publish('loadingData');
    } 

    attached(){

      this.ea.subscribe('newProductsUpdated', (length : number) =>{
        this.productAddedCount = length;
      });

      this.ea.subscribe('selecaoDeProdutosLoaded', () =>{ 
          this.selecaoDeProdutosLoaded = true;
          if(this.selecaoDeProdutosLoaded && this.historicoDeImportacaoLoaded  && this.atualizacaoDePrecosLoaded){
            this.ea.publish('dataLoaded');
          }
      });

      this.ea.subscribe('historicoDeImportacaoLoaded', () =>{ 
          this.historicoDeImportacaoLoaded = true;
          if(this.selecaoDeProdutosLoaded && this.historicoDeImportacaoLoaded   && this.atualizacaoDePrecosLoaded){
            this.ea.publish('dataLoaded');
          }
      });

      this.ea.subscribe('listaDePrecosLoaded', () =>{ 
         /* this.listaDePrecosLoaded = true;
          if(this.selecaoDeProdutosLoaded && this.historicoDeImportacaoLoaded  && this.atualizacaoDePrecosLoaded){
            this.ea.publish('dataLoaded');
          } */
      });

      this.ea.subscribe('atualizacaoDePrecosLoaded', () =>{ 
          this.atualizacaoDePrecosLoaded = true;
          if(this.selecaoDeProdutosLoaded && this.historicoDeImportacaoLoaded   && this.atualizacaoDePrecosLoaded){
            this.ea.publish('dataLoaded');
          }
      });
    }
} 