import { Component, OnInit } from '@angular/core';

import { HttpClient, HttpHeaders  } from '@angular/common/http';

import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';

export class Options {

    public shippingCost: any;

    constructor(
        public db: AngularFirestore
    ){

        this.db.collection('options', data => data.where('meta-key','==','shipping-price')).get().subscribe(resp =>{

            console.log('Shipping Cost Before');
            console.log(this.shippingCost);
            resp.forEach(e =>{
                this.shippingCost = e.data()['meta-value'];
            });
            console.log('shippingCost')
            console.log(this.shippingCost);

        });

    }

    getShippingPrice(){

        console.log('Shipping COst');
        console.log(this.shippingCost);
        return this.shippingCost;
    
    }

}
