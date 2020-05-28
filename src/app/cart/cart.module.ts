import { NgModule, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularFirestore } from '@angular/fire/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';

import {
  Router,
  ActivatedRoute,
  Params
 } from '@angular/router';

import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';

import { AuthenticationService } from "../shared/authentication-service";


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CartModule { 

  public userID: any;

  constructor(
    public db: AngularFirestore,
    public auth: AuthenticationService,
    public fire: Firebase,
    public authFire: FirebaseAuthentication,
    public route: Router
  ){
  }
  
  addToCart(itemId: string, shopId:string){

      // User ID de Authentication
      this.userID = this.auth.userData.uid;
      this.db.collection('carts',res=>res.where('userMeta','==',this.userID+','+shopId)).get().subscribe(datas => {

      let cartDatas:any = {};
        
      // Si pas de panier existant 
      if(datas.size == 0){

        cartDatas = {
          userMeta:this.userID+','+shopId,
          items:[{id:itemId,qty:1}],
          userId:this.userID,
          shopId:shopId
        }
        this.db.collection('carts').add(cartDatas);
        this.route.navigate(['confirm-order'], {
          queryParams: {
           shopId: shopId
          }
         });

      }else{

        // On boucle sur les produits
        datas.forEach(cart=>{

          let items = cart.data()['items'];
          let newCardInfo:any = [];
          let isExist = items.filter(e=>e.id==itemId).map(item=>{
            items.map(olditem=>{
              console.log('oldItems');
              console.log(olditem);
              if(olditem.id != item.id){
                newCardInfo.push(olditem);
              }
            })
            console.log('item exist');
            console.log(item);
            item.qty ++
            newCardInfo.push(item)
          })
          if(isExist.length == 0){
            items.map(olditem=>{
              console.log('oldItems');
              console.log(olditem);
              newCardInfo.push(olditem);
            })
            newCardInfo.push({
              id:itemId,
              qty:1
            });
          }
          this.db.doc('carts/'+cart.id).update({items:newCardInfo});
          this.route.navigate(['confirm-order'], {
            queryParams: {
             shopId: shopId
            }
           });

        })

      }


    });


  }

  remToCart(itemId: string, shopId:string){

    // User ID de Authentication
    this.userID = this.auth.userData.uid;
    this.db.collection('carts',res=>res.where('userMeta','==',this.userID+','+shopId)).get().subscribe(datas => {

    let cartDatas:any = {};

      // On boucle sur les produits
      datas.forEach(cart=>{

        let items = cart.data()['items'];
        let newCardInfo:any = [];
        let isExist = items.filter(e=>e.id==itemId).map(item=>{
          items.map(olditem=>{
            console.log('oldItems');
            console.log(olditem);
            if(olditem.id != item.id){
              newCardInfo.push(olditem);
            }
          })
          console.log('item exist');
          console.log(item);
          item.qty --
          if(item.qty<1){
            
          }else{
            newCardInfo.push(item)
          }
        })
        this.db.doc('carts/'+cart.id).update({items:newCardInfo});
        this.route.navigate(['confirm-order'], {
          queryParams: {
           shopId: shopId
          }
         });

      })


  });


}

  getRecapCart(shopId){

     // User ID de Authentication
    //  this.userID = this.auth.userData.uid;
    this.userID = "lLOIicPjoQawymGvEx6mLY8SUhy2";
     console.log(this.userID);

    let query = this.db.collection('carts', ref => ref.where('userId','==',this.userID)).get().subscribe(datas=>{
      let itemList = [];
      console.log('allItemforUserToThisShop' + shopId);
      datas.forEach(item=>{
        if(item.data()['shopId'] == shopId){
          console.log(item.data());
          itemList.push(item.data());
        }
      });
      console.log(itemList);
      return itemList;

    });

  }

}
