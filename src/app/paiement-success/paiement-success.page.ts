import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import {Router, ActivatedRoute, Params} from '@angular/router';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-paiement-success',
  templateUrl: './paiement-success.page.html',
  styleUrls: ['./paiement-success.page.scss'],
})
export class PaiementSuccessPage implements OnInit {

  constructor(
    public activatedRoute: ActivatedRoute,
    public route: Router,
    public db: AngularFirestore
  ) { }

  public orderId:any;
  public orderDetails:any;
  public orderKm:any;
  public totalAmount:any;
  public totalShipping:any;
  public cartItem: any = [];

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      console.log('Params1');
      console.log(params);
     });

     this.db.doc('orders/'+this.orderId).get().subscribe(order=>{
        console.log(order.data());
        this.orderKm = order.data()['orderKm'];
        this.totalAmount = parseInt(order.data()['amount']) / 100;
        this.totalShipping = parseInt(order.data()['amountShipping']);
        this.db.doc('carts/'+order.data()['cartId']).get().subscribe(cart=>{

          cart.data()['items'].forEach(item => {
              this.db.doc('products/'+item.id).get().subscribe(product=>{
                this.cartItem.push({
                  'cart':item,
                  'product':product.data()
                });
                console.log(this.cartItem);
              })
          });

        })

     });

  }

}
