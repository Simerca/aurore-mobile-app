import { Component, OnInit, NgZone } from '@angular/core';
import { AuthenticationService } from "../shared/authentication-service";
import { MenuController } from '@ionic/angular';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Options } from '../options';
import { MapboxServiceService, Feature } from '../mapbox/mapbox-service.service';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import { environment } from 'src/environments/environment';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { CartModule } from '../cart/cart.module';

declare var that;

@Component({
  selector: 'app-delivman',
  templateUrl: './delivman.page.html',
  styleUrls: ['./delivman.page.scss'],
})
export class DelivmanPage implements OnInit {

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
    public menu: MenuController,
    public ngZone: NgZone
  ) {

    
   }

    // Initialisation des variables 
    loading = false;
    mapIsLoading: boolean = true;
  
    //Mapbox var
    markerTargetLnt: string;
    markerTargetLat: string;
  
    map: any;

    //Variables commandes
    orders: any[] = [];

    // Cout de la livraison 
    shippingCost: any;

    public delivmanCoords:any;


  ngOnInit() {

    // AccessToken de mapBox
    mapboxgl.accessToken = environment.mapbox.accessToken;

    this.map = new mapboxgl.Map({
      container: 'mapDelivman',
      style: 'mapbox://styles/mapbox/streets-v9?optimize=true', // tslint:disable-next-line:no-magic-numbers
      center:  [0.3969645,46.2334887], 
      zoom: 5
    });

    
    var geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });

    that = this;

    this.map.addControl(geolocate);
    this.map.on('load', function() {
      geolocate.trigger();
      that.mapIsLoading = false;
      that.map.resize();
     });
     console.log('geolocate is')

     geolocate.on('geolocate', function(resp) {

      console.log('resp is')
      console.log(resp.coords.longitude);
      // resp.coords.latitude
      // resp.coords.longitude

      that.delivmanCoords = resp.coords.longitude+','+resp.coords.latitude;
    

      that.mapIsLoading = false;
      that.checkLiveOrder(resp);
      // Marker to user
      // const point: {} = new mapboxgl.Marker()
      // .setLngLat([resp.coords.longitude, resp.coords.latitude])
      // .addTo(this.map);

    });

  }

  getAnOrder(id){

    this.db.doc('orders/'+id).get().subscribe(order=>{
      console.log(order.data());
      if(order.data()['state'] == "0"){
        let update = {
          state:"1",
          delivmanCoords:this.delivmanCoords,
          delivmanId:this.authService.userData.uid
        }
        this.db.doc('orders/'+id).update(update).then(e=>{
          this.ngZone.run(() => this.route.navigate(['track'],{ queryParams: { orderId: id,isDelivman:true } }));
        })
      }
    })

  }

  checkLiveOrder(resp){

    // Recuperation cout de la livraison 
    this.shippingCost = this.option.shippingCost;

    // Recuperation de toutes les commandes non traiter
    this.db.collection('orders', ref=>ref.where('state','==','0')).snapshotChanges().subscribe(datas=>{
      this.orders = [];
      datas.map(e=>{

          
          let result:any = {
            coordsClient:e.payload.doc.data()['coordsClient'],
            coordsShop:e.payload.doc.data()['coordsShop']
          }
          console.log(result);
          
          // resp.coords.latitude
          // resp.coords.longitude
        
          // Fonction pour recuperer la disatance entre 2 points GPS 
          let delivmanCoords = resp.coords.longitude +','+resp.coords.latitude; 

          let clientCoords = result.coordsClient;
          let shopCoords = result.coordsShop;
        
          let url = 'https://api.mapbox.com/directions/v5/mapbox/driving/'+delivmanCoords+';'+clientCoords+'?access_token=pk.eyJ1Ijoic2ltZXJjYSIsImEiOiJjazlueHgzcHkwNHFtM2RtcnAxMmozeW05In0.ki6JAf5xEO_hyrEDZ1mFrA';
      
          console.log(url);
          const headers = new HttpHeaders()
              .set('cache-control', 'no-cache')
              .set('content-type', 'application/json') 
      
          this.http.get(url, { headers: headers }).subscribe(res => {

            console.log('pos is');
            console.log(res);

             // Distance entre le client et le livreur
             let orderCoordsInfo: any = res;

             // Si la distance est inferieur a 10km
             if(orderCoordsInfo.routes[0].distance < 10000){
                console.log('is not too far');
               result.distance = Math.round(orderCoordsInfo.routes[0].distance.toFixed(2) / 1000);
               result.shippingGain = (parseFloat(result.distance)  * parseFloat(this.option.shippingCost))*80 / 100;
               result.id = e.payload.doc.id;
               console.log('shippingCost');
               console.log(this.option.shippingCost);
               console.log('result is');
               console.log(result);
               
             this.orders.push(result);

             }

            this.loading = false;

          });
          
        });


    });

  }

}
