import { Component, OnInit, Input, NgZone } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { HttpClient, HttpHeaders, HttpHandler  } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthenticationService } from "../shared/authentication-service";
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

declare var that;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  @Input() amount: any;
  @Input() amountShipping: any;
  @Input() orderKm: any;
  @Input() cartId: any;
  @Input() coordClient: any;
  @Input() coordsShop: any;
  @Input() auroreWithTree: boolean = false;
  @Input() basketCartId: any;


  public addingCard:boolean = false;

  public paymentMethods:any = {};

  // MangoPay Var 
  public card:any = {};
  public PreregistrationData:any;
  public AccessKey:any;
  public cardData:any;
  public cardRegistrationUrl:any;
  public clientId:string = 'joudiapp';
  public apiKey:string = 'eFH2EHhBeFWi3t4SgTkFjTLYkgLKa49jEm4ZTnMraKefFYA9k4';
  public url:string = 'https://api.sandbox.mangopay.com';
  public userMangopayId:any;
  public userWalletMangopayId:any;
  public cardRegistrationId:any;
  public cardId:any;
  public cardLists:any
  public cardListView:any


  constructor(
    public http: HttpClient,
    public auth: AuthenticationService,
    public route: Router,
    public modalCtrl: ModalController,
    public db: AngularFirestore,
    private ngZone: NgZone,
    private iab: InAppBrowser
  ) { 

    this.paymentMethods = [
      {
        name:'Ajouter une carte Bancaire',
        type:'addcb',
        icon:'../../assets/credit-card-solid.svg'
      }
    ]

  }

  ngOnInit() {

    this.db.doc('users/'+this.auth.userData.uid).snapshotChanges().subscribe(res => {
      let userData:any = res;
      this.userMangopayId = userData.payload.data()['mangoPayId'];
      console.log(this.userMangopayId)
      this.cardLists = userData.payload.data()['cards'];
      console.log(userData.payload.data())
      this.cardListView = [];
      this.cardLists.forEach(cardRES => {

        let UrlViewCard = "/v2.01/"+this.clientId+"/cards/"+cardRES.cardId
        
        const headers = new HttpHeaders()
              .set('content-type', 'application/json')
              .set('Authorization', 'Basic '+btoa(this.clientId+':'+this.apiKey))

          this.http.get(this.url+UrlViewCard, { headers: headers }).subscribe(res => {
            
            let datas:any = res;
            console.log(datas);
            this.cardListView.push(datas)
              
          });

      })

    })

  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  // Action Launcher :
  doAction(type){
    console.log(type);
    switch(type){
      case "addcb":
        this.addCb();
        break;
    }
  }

  addCb(){

    this.addingCard = true;
    

  }

  // MangoPay Principe 
  // MangoPay Principe 


  cardRegistration(){

    const headers = new HttpHeaders()
              .set('content-type', 'application/json')
              .set('Authorization', 'Basic '+btoa(this.clientId+':'+this.apiKey))

              console.log(btoa(this.clientId+':'+this.apiKey));
              
              let body = {
                "UserId": this.userMangopayId,
                "Currency": "EUR",
                "CardType": "CB_VISA_MASTERCARD"
                }

          this.http.post(this.url+'/v2.01/'+this.clientId+'/cardregistrations/',body, { headers: headers }).subscribe(res => {

            let result:any = res;
            console.log(res);
            console.log(result.PreregistrationData);
            this.PreregistrationData = result.PreregistrationData;
            console.log(result.AccessKey);
            this.AccessKey = result.AccessKey;
            this.cardRegistrationId = result.Id;
            this.cardRegistrationUrl = result.CardRegistrationURL
            this.saveCard();
              
          });

  }

  saveCard(){
    
    let body3 = new URLSearchParams();
      body3.set('data', this.PreregistrationData);
      body3.set('accessKeyRef', this.AccessKey);
      body3.set('cardNumber', this.card.number);
      body3.set('cardExpirationDate', this.card.expiry);
      body3.set('cardCvx', this.card.ccv);

    const headers = new HttpHeaders()
              .set('content-type', 'application/x-www-form-urlencoded')

                this.http.post(this.cardRegistrationUrl,body3.toString(), { headers: headers }).subscribe(res => {
                  console.log(res);
                  this.cardData = res;
                },error=>{
                  console.log(error)
                  this.cardData = error.error.text;

                  // Put Card Data

                  const headers = new HttpHeaders()
                  .set('content-type', 'application/json')
                  .set('Authorization', 'Basic '+btoa(this.clientId+':'+this.apiKey))

                  console.log(btoa(this.clientId+':'+this.apiKey));
                  
                  let body = {
                    "RegistrationData": this.cardData
                    }

                  this.http.put(this.url+'/v2.01/'+this.clientId+'/CardRegistrations/'+this.cardRegistrationId,body, { headers: headers }).subscribe(res => {

                    let result:any = res;
                    this.cardId = result.CardId
                    console.log(res);

                    this.db.doc('users/'+this.auth.userData.uid).get().subscribe(userData => {
                      let cards:any = [];
                      let userInfo = userData.data();
                      console.log(cards)
                      console.log(userData.data()['cards'])
                      if(userData.data()['cards'] == undefined){

                      }else{
                        userData.data()['cards'].forEach(element => {
                          cards.push(element);
                        });
                      }
                      cards.push({cardId:this.cardId});
                      console.log(cards)
                      userInfo.cards = cards;
                      this.db.doc('users/'+this.auth.userData.uid).set(userInfo);

                    })
                      
                  });

               // Put Card Data

          });

  }

  createDirectPayIn(cardID){

    const headers = new HttpHeaders()
              .set('content-type', 'application/json')
              .set('Authorization', 'Basic '+btoa(this.clientId+':'+this.apiKey))

              console.log(btoa(this.clientId+':'+this.apiKey));
              
              let body =  {
                    "AuthorId": this.userMangopayId,
                    "CreditedUserId": "80054171",
                    "CreditedWalletId": "80054172",
                    "DebitedFunds": {
                    "Currency": "EUR",
                    "Amount": this.amount
                    },
                    "Fees": {
                    "Currency": "EUR",
                    "Amount": 12
                    },
                    "SecureModeReturnURL": "http://www.my-site.com/returnURL",
                    "CardId": cardID,
                    "SecureMode": "DEFAULT",
                    "Billing": {
                    "Address": {
                    "AddressLine1": "1 Mangopay Street",
                    "AddressLine2": "The Loop",
                    "City": "Paris",
                    "Region": "Ile de France",
                    "PostalCode": "75001",
                    "Country": "FR"
                    }
                    },
                    "StatementDescriptor": "Mar2016",
                    "Culture": "EN",
                    "Tag": "Custom description for this specific PayIn"
                    }

          this.http.post(this.url+'/v2.01/'+this.clientId+'/payins/card/direct/',body, { headers: headers }).subscribe(res => {

            console.log(res);
            let result:any = res;

            if(result.SecureModeRedirectURL != undefined) {
              
              const iosoption: InAppBrowserOptions = {
                zoom: 'no',
                location:'yes',
                toolbar:'yes',
                clearcache: 'yes',
                clearsessioncache: 'yes',
                disallowoverscroll: 'yes',
                enableViewportScale: 'yes'
              }
              
              const browser = this.iab.create(result.SecureModeRedirectURL, '_blank', iosoption);

            }

            if(result.Status == "SUCCEEDED"){

              // Enregirstrement commande
              let orderInfo:any = {
                coordsClient:this.coordClient,
                amount:this.amount,
                amountShipping:this.amountShipping,
                orderKm:this.orderKm,
                auroreWithTree:this.auroreWithTree,
                cardId:cardID,
                cartId:this.basketCartId,
                clientId:this.auth.userData.uid,
                delivmanId:"",
                delivmanCoords:"",
                coordsShop:this.coordsShop,
                state:"0"
              }

              console.log(orderInfo);
              this.db.collection('orders').add(orderInfo).then(resp=>{
                this.dismiss();
                this.ngZone.run(() => this.route.navigate(['paiement-success'],{ queryParams: { orderId: resp.id } }));
              });

            }else{
              this.route.navigate(['paiement-error']);
              this.dismiss();
            }

        });

      }


  // MangoPay Principe 
  // MangoPay Principe 



}
