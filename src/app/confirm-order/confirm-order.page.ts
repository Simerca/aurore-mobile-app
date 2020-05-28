import {
  Component,
  OnInit
 } from '@angular/core';
 import {
  PayPal,
  PayPalPayment,
  PayPalConfiguration
 } from '@ionic-native/paypal/ngx';
 import {
  CartModule
 } from "../cart/cart.module";
 import {
  Router,
  ActivatedRoute,
  Params
 } from '@angular/router';
 
 import {
  AngularFirestore,
  AngularFirestoreDocument
 } from '@angular/fire/firestore';
 import {
  Firebase
 } from '@ionic-native/firebase/ngx';
 
 import {
  FirebaseAuthentication
 } from '@ionic-native/firebase-authentication/ngx';
 
 import {
  AuthenticationService
 } from "../shared/authentication-service";
 import {
  HttpClient,
  HttpHeaders,
  HttpHandler
 } from '@angular/common/http';
 import {
  Geolocation
 } from '@ionic-native/geolocation/ngx';
 
 import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
 import {
  ModalController
 } from '@ionic/angular';
 import {
  ModalPage
 } from '../modal/modal.page';
 
 import {
  Options
 } from '../options';
 import {
  windowWhen
 } from 'rxjs/operators';
 import { environment } from 'src/environments/environment';
 
 declare var paymentspring;
 declare var that;
 
 
 @Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.page.html',
  styleUrls: ['./confirm-order.page.scss'],
 })
 export class ConfirmOrderPage implements OnInit {
 
 
 
  constructor(
   public payPal: PayPal,
   public cart: CartModule,
   public activatedRoute: ActivatedRoute,
   public db: AngularFirestore,
   public auth: AuthenticationService,
   public fire: Firebase,
   public http: HttpClient,
   public geo: Geolocation,
   public option: Options,
   public modalController: ModalController,
   public authFire: FirebaseAuthentication,
   public route: Router
  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.shopId = params['shopId'];
      console.log('Params1');
      console.log(params);
    });
 
  }
 
  // Price Variable 
  public totalPrice: number = 0;
  public totalShippingPrice: number = 0;
 
  public itemLat: string;
  public itemLnt: string;
  coords: string = '';
 
  shopId: string = "1";
  public coordsShop: any;
  public cartList: any[] = [];
  userID: any;
  shippingCost: number = 1.2;
  public cartId: any[] = [];

  respParsed:any;
  public basketCartId:any;
  public itemsShop:any;
 
  public paymentOk: boolean = true;
 
  public token: any;
  mapConfirmOrder:any;

  distanceToItem:number;
  itemCoords:any;
 
  public aurorWithTree:boolean = false;

  public totalCost;

  ngOnInit() {
 
 
  

     // AccessToken de mapBox
     mapboxgl.accessToken = environment.mapbox.accessToken;

     this.mapConfirmOrder = new mapboxgl.Map({
       container: 'mapConfirmOrder',
       style: 'mapbox://styles/mapbox/streets-v9?optimize=true', // tslint:disable-next-line:no-magic-numbers
       center: [0.3969645,46.2334887], 
       zoom: 5
     });


   var geolocateConfirmOrder = new mapboxgl.GeolocateControl({
     positionOptions: {
       enableHighAccuracy: true
     },
     trackUserLocation: true
   });

   that = this;

   this.mapConfirmOrder.addControl(geolocateConfirmOrder);
   this.mapConfirmOrder.on('load', function() {
    geolocateConfirmOrder.trigger();
     that.mapIsLoading = false;
     that.mapConfirmOrder.resize();
     that.getRecapCart(that.shopId);
     
    });

    geolocateConfirmOrder.on('geolocate', function(resp) {
      
      console.log('geolocate googogogogo');
      });
      geolocateConfirmOrder.on('trackuserlocationstart', function(resp) {
        console.log('A trackuserlocationstart event has occurred.')
        console.log(resp);
       
        
      });

 
      this.loadItemsShop();


   // this.onPay();
 
  }

  getRecapCart(shopId){

        // User ID de Authentication
  //  this.userID = this.auth.userData.uid;
   this.userID = "1xUltXggdcZsgUoSp4lPqcJrhr53";
   let resp = this.respParsed;
   
   let query = this.db.collection('carts', ref => ref.where('userMeta', '==', this.userID + ',' + shopId)).snapshotChanges().subscribe(datas => {
    this.cartList = [];
      this.paymentOk = true;
      this.totalPrice = 0;
      this.totalShippingPrice = 0;
    //On prend les items du shop numero shopId

    console.log(datas);
    datas.forEach(items => {
      this.basketCartId = items.payload.doc.id;
     if (items.payload.doc.data()['shopId'] == shopId) {
 
      items.payload.doc.data()['items'].forEach(item => {
 
       this.db.collection('products').doc(item.id).get().subscribe(itemDatas => {
 
        // Price Calculcation 
        this.totalPrice += parseFloat(itemDatas.data()['price']) * parseInt(item.qty);
 
        this.itemLnt = itemDatas.data()['lnt'];
        this.itemLat = itemDatas.data()['lat'];
        // Asignation du tableau 
        this.cartList.push({
         data: itemDatas.data(),
         cart: item
        });
        this.itemCoords = this.itemLnt + ',' + this.itemLat;
        this.coordsShop = this.itemCoords;
        this.calculShippingPrice()
        
 

 
       })
 
      })
 
 
     }
    });
    
 
   });
  }

  calculShippingPrice(){

    this.coords = this.respParsed.coords.longitude + ',' + this.respParsed.coords.latitude;
    console.log('Read Item coords')

    let url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + this.coords + ';' + this.itemCoords + '?access_token=pk.eyJ1Ijoic2ltZXJjYSIsImEiOiJjazlueHgzcHkwNHFtM2RtcnAxMmozeW05In0.ki6JAf5xEO_hyrEDZ1mFrA';
 
         console.log(url);
         const headers = new HttpHeaders()
          .set('cache-control', 'no-cache')
          .set('content-type', 'application/json')
          .set('postman-token', 'b408a67d-5f78-54fc-2fb7-00f6e9cefbd1');
 
         const body = {}
 
         this.http.get(url, {
           headers: headers
          })
          .subscribe(res => {
            
            let itemCoordsInfo:any = res;
            if (itemCoordsInfo.routes[0].distance < 10000) {
              this.distanceToItem = Math.round(itemCoordsInfo.routes[0].distance.toFixed(2) / 1000);
              this.totalShippingPrice = this.distanceToItem * this.option.shippingCost;
              
              if(isNaN(this.totalShippingPrice)){
                this.calculShippingPrice();
              }else{
                this.totalShippingPrice = Math.round(this.totalShippingPrice * 100) / 100
                this.calculTotalCost()
                this.paymentOk = false;
              }
            }

          });
  }

  calculTotalCost(){

    this.totalCost = Math.round((this.totalPrice + this.totalShippingPrice) * 100) / 100;

  }
 
  async presentModal() {
   const modal = await this.modalController.create({
    component: ModalPage,
    swipeToClose: true,
    componentProps: {
     'amount': ((this.totalPrice + this.totalShippingPrice) * 100),
     'amountShipping': this.totalShippingPrice,
     'orderKm': this.distanceToItem,
     'cartId': this.cartId,
     'coordClient': this.coords,
     'basketCartId': this.basketCartId,
     'coordsShop': this.coordsShop,
     'auroreWithTree': this.aurorWithTree
    }
   });
   return await modal.present();
  }

  addToCart(itemId) {
    this.cart.addToCart(itemId, this.shopId);
    
  }
  remToCart(itemId){
    this.cart.remToCart(itemId,this.shopId)
  }

  loadItemsShop(){

    this.db.collection('products',ref=>ref.where('shopId','==',this.shopId)).snapshotChanges().subscribe(datas => {
      this.itemsShop = datas.map(e => {
   
       return {
        id: e.payload.doc.id,
        name: e.payload.doc.data()['name'],
        lnt: e.payload.doc.data()['lnt'],
        lat: e.payload.doc.data()['lat'],
        keyword: e.payload.doc.data()['keyword'],
        price: e.payload.doc.data()['price'],
        shopName: e.payload.doc.data()['shopName'],
        shopId: e.payload.doc.data()['shopId'],
        img: e.payload.doc.data()['img'],
        shopAdress: e.payload.doc.data()['shopAdress'],
        priceSuffix: e.payload.doc.data()['priceSuffix'],
        categorie: e.payload.doc.data()['categorie'],
       };
      });
     });
    
  }


  updatePriceAuroreWithTree() {

    console.log('input');
    console.log(this.aurorWithTree);

    if(this.aurorWithTree){
      this.totalPrice = this.totalPrice + .10;
    }else{
      this.totalPrice = this.totalPrice - .10;
    }

    this.calculTotalCost()

  }
 
 
 
  onPay() {
 
   this.payPal.init({
    PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
    PayPalEnvironmentSandbox: 'AYzzMz_Z9mshCNJuiR5k-NDsSHPBVZszP3epDuYKgJUAYdOE-P6-flfN96pKktZo1bAPgDRg3OyPKjBx'
   }).then(() => {
    // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
    this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
     // Only needed if you get an "Internal Service Error" after PayPal login!
     //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
    })).then(() => {
     let toPayed = this.totalPrice + this.totalShippingPrice;
     let payment = new PayPalPayment('' + toPayed, 'EUR', 'Description', 'sale');
     this.payPal.renderSinglePaymentUI(payment).then(() => {
      // Successfully paid
 
      // Example sandbox response
      //
      // {
      //   "client": {
      //     "environment": "sandbox",
      //     "product_name": "PayPal iOS SDK",
      //     "paypal_sdk_version": "2.16.0",
      //     "platform": "iOS"
      //   },
      //   "response_type": "payment",
      //   "response": {
      //     "id": "PAY-1AB23456CD789012EF34GHIJ",
      //     "state": "approved",
      //     "create_time": "2016-10-03T13:33:33Z",
      //     "intent": "sale"
      //   }
      // }
     }, () => {
      // Error or render dialog closed without being successful
     });
    }, () => {
     // Error in configuration
    });
   }, () => {
    // Error in initialization, maybe PayPal isn't supported or something else
   });
 
  }
 
 
  // Payment Spring Test
  // Payment Spring Test
 
 
  // You'll find this API key in your account settings.
  public publicKey = "test_2f407c56055a3d36e5ad22faa829f46588b230170dbefba404e7f44648"
 
  // We'll need to build this from our form -- in this case,
  // we've hard-coded with test account information. You'll
  // usually scrape this information from a form using
  // Javascript and will then, instead of the normal form
  // submission, you'll create the token and if it's
  // successful you'll submit the charge or create/edit the
  // customer.
  //
  // Per above, the keys here should be the same as the params
  // in the token-creation endpoint. The values will the the
  // actual data.
  public paymentData = {
   // This is from our test card numbers
   "card_owner_name": "Grace Hopper",
   "card_number": "4111111111111111",
   "card_exp_month": "12",
   "card_exp_year": "2029",
   "csc": "999"
  }
 
  // If we wanted to submit ACH information instead, we can
  // do so like this instead:
  // var paymentData = {
  //   "token_type": "bank_account",
  //   "bank_account_number": "1234567890",
  //   "bank_routing_number": "100004058",
  //   "bank_account_holder_first_name": "Grace",
  //   "bank_account_holder_last_name": "Hopper",
  //   "bank_account_type": "checking"
  // }
  //
  // We can also pass in Address information. See the token creation
  // documentation (link above) for guidance on how to do that.
 
  // We need to register a callback to use the tokenizer;
  // this is a function that gets called once the tokenizer
  // is done fetching the token. Typically, it'll do things
  // like submit the form (as well as wipe relevant PAN data).
  //
  // This callback function is illustrative only; it simply
  // writes to the console log.
  //
  // You will need to create your own.
 
  // Finally, we get our response.
 
  psCreateToken() {
 
   that = this;
   let token = paymentspring.generateToken(this.publicKey, this.paymentData, this.makePayment)
 
   console.log('token is');
   console.log(token);
 
  }
 
  makePayment(reponse) {
   console.log('That Works ?');
   console.log(that);
   that.doPayment(reponse);
   return reponse;
  }
 
  doPayment(response) {
 
   console.log('That Work Menn !!');
   console.log(response);
   const headers = new HttpHeaders()
    .set('content-type', 'application/json')
 
   let body = {
    token: response.id,
    userId: this.auth.userData.uid,
    cartId: this.cartId,
    amount: ((this.totalPrice + this.totalShippingPrice) * 100)
   }
 
   this.http.post('http://joudi-tech.mon.world/payment/', body, {
    headers: headers
   }).subscribe(res => {
    console.log('Payment Response');
    let paymentData: any = res;
    if (paymentData.authorized) {
     this.route.navigate(['paiement-success']);
    } else {
     this.route.navigate(['paiement-error']);
    }
   });
  }
 
 
  // Payment Spring Test
  // Payment Spring Test
 
 
 
 }