import { Product } from '../domain/product';
import { Aurelia, autoinject, inject, NewInstance} from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
import { EventAggregator } from 'aurelia-event-aggregator';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';

@autoinject
export class Produtos {

    productAddedCount : number;

    constructor(private router: Router, private ea : EventAggregator) {
      
      this.productAddedCount = 0;
    } 

    attached(){

      this.ea.subscribe('newProductsUpdated', (length : number) =>{
        this.productAddedCount = length;
      })
    }
} 