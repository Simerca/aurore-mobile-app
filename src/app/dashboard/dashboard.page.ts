import {
  Component,
  OnInit
 } from '@angular/core';
 import {
  AuthenticationService
 } from "../shared/authentication-service";
 import {
  MenuController
 } from '@ionic/angular';
 import {
  HttpClient,
  HttpHeaders
 } from '@angular/common/http';
 import {
  Geolocation
 } from '@ionic-native/geolocation/ngx';
 import {
  AngularFirestore,
  AngularFirestoreCollection
 } from '@angular/fire/firestore';
 import {
  Observable
 } from 'rxjs';
 import {
  Options
 } from '../options';
 import {
  MapboxServiceService,
  Feature
 } from '../mapbox/mapbox-service.service';
 import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
 import {
  environment
 } from 'src/environments/environment';
 import {
  Router,
  ActivatedRoute,
  Params
 } from '@angular/router';
 import {
  CartModule
 } from '../cart/cart.module';
 
 declare var that;

 export interface ProductCat {
  name: string;
 }
 
 @Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
 
 })
 
 export class DashboardPage implements OnInit {
 
  // Initialisation des variables 
  hideMe = true;
  loading = false;
  productCat: Observable < ProductCat[] > ;
  ProductCategoryList: any;
  items: any;
  itemsList: any;
  coords: string = '';
  searchValue: any;
  shippingCost: any;
  showPanelSearch: boolean = false;
  recapPopupShow: boolean = false;
  mapIsLoading: boolean = true;
  respParsed: any;
 
  //Mapbox var
  markerTargetLnt: string;
  markerTargetLat: string;
 
  addresses: string[] = [];
  selectedAddress = null;
  map: any;
 
  panelSearch: string = '';

  searchInProgress: boolean = false;
 
 
  constructor(
   public authService: AuthenticationService,
   public db: AngularFirestore,
   public http: HttpClient,
   public geo: Geolocation,
   private mapboxService: MapboxServiceService,
   public activatedRoute: ActivatedRoute,
   public route: Router,
   public option: Options,
   public cart: CartModule,
   public menu: MenuController
  ) {
   this.loadCat();
   // this.initializeItems();
  }
 
  sendPostRequest(itemCoords = null) {
 
  }
 
  // Fonction intermediaire d'ajout au panier 
  addCart(itemId, shopId) {
   this.cart.addToCart(itemId, shopId);
   this.recapPopupShow = true;
 
   
   return true;
  }
 
  // Chargement des categories
  loadCat() {
   this.db.collection('products-category').snapshotChanges().subscribe(datas => {
    this.ProductCategoryList = datas.map(e => {
     return {
      id: e.payload.doc.id,
      name: e.payload.doc.data()['name'],
     };
    });
   });
  }
 
 
  ngOnInit() {
 
 
   // AccessToken de mapBox
   mapboxgl.accessToken = environment.mapbox.accessToken;
 
    // resp.coords.latitude
    // resp.coords.longitude
    this.map = new mapboxgl.Map({
     container: 'map',
     style: 'mapbox://styles/mapbox/streets-v9?optimize=true', // tslint:disable-next-line:no-magic-number
     center: [0.3969645,46.2334887], 
     zoom: 5
    });
 
    var geolocate = new mapboxgl.GeolocateControl({
     positionOptions: {
      enableHighAccuracy: true
     },
     trackUserLocation: true
    });
 
 
    this.map.addControl(geolocate);
    this.map.on('load', function() {
     geolocate.trigger();
     that.map.resize();
    });

    that = this;

    geolocate.on('geolocate', function(resp) {

      that.respParsed = resp;

   });
 
 
    this.mapIsLoading = false;
 
    // Marker to user
    // const point: {} = new mapboxgl.Marker()
    // .setLngLat([resp.coords.longitude, resp.coords.latitude])
    // .addTo(this.map);
 
 
   this.loadItems();
 
  }
 
 
  // Ajout d un marker sur la carte
  setMarker(lnt, lat) {
 
   const point: {} = new mapboxgl.Marker()
    .setLngLat([lnt, lat])
    .addTo(this.map);
 
   this.map.jumpTo({
    center: [lnt, lat]
   });
 
   this.showPanelSearch = false;
 
  }
 
  // Chargement des items 
  loadItems(val = "") {
 
   this.db.collection('products').snapshotChanges().subscribe(datas => {
    this.items = datas.map(e => {
 
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
 
  searchQuery: string = '';
 
  // Chargement des listes d'item 
  getItems() {

    this.searchInProgress = true;
   // Initialisation des cout de livraison 
   this.shippingCost = this.option.shippingCost;
 
   this.loading = true;
   // Reset items back to all of the items
   const val = this.searchValue;
   this.loadItems(val);
   // set val to the value of the searchbar
 
 
   // if the value is an empty string don't filter the items
   if (val && val.trim() != '') {
    this.itemsList = this.items.filter((item) => {
     this.hideMe = false;
 
     // requette HTTP pour la distance entre les 2 points
 
 
     let itemCoords = item.lnt + ',' + item.lat;

     const options = {
      enableHighAccuracy: true, 
      maximumAge: 30000, 
      timeout: 5000
    };

    let resp = this.respParsed;
 
     // Fonction pour recuperer la geolocalistation de l utilisateur 
      // resp.coords.latitude
      // resp.coords.longitude
 
      // Fonction pour recuperer la disatance entre 2 points GPS 
      this.coords = resp.coords.longitude + ',' + resp.coords.latitude;
      let url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + this.coords + ';' + itemCoords + '?access_token=pk.eyJ1Ijoic2ltZXJjYSIsImEiOiJjazlueHgzcHkwNHFtM2RtcnAxMmozeW05In0.ki6JAf5xEO_hyrEDZ1mFrA';
 
      console.log(url);
      const headers = new HttpHeaders()
       .set('cache-control', 'no-cache')
       .set('content-type', 'application/json')
       .set('postman-token', 'b408a67d-5f78-54fc-2fb7-00f6e9cefbd1');
 
      this.http.get(url, {
       headers: headers
      }).subscribe(res => {
 
       let itemCoordsInfo: any = res;
 
       if (item.keyword.toLowerCase().indexOf(val.toLowerCase()) > -1) {
        //if(itemCoordsInfo.routes[0].distance < 10000){
        item.distance = Math.round(itemCoordsInfo.routes[0].distance.toFixed(2) / 1000);
        item.cost = parseFloat(item.price) + (item.distance * parseFloat(this.shippingCost));
 
        this.itemsList.push(item);
        //}
       }
       this.loading = false;
       this.searchInProgress = false;
       this.showPanelSearch = true;
 
      });
 
    })
 
   } else {
    this.itemsList = [];
    this.hideMe = true;
 
   }
  }
 
 }