import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import { environment } from 'src/environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {
  HttpClient,
  HttpHeaders,
  HttpHandler
 } from '@angular/common/http';
import { Platform } from '@ionic/angular';

import * as L from '@mapbox/polyline';

declare var that;


@Component({
  selector: 'app-track',
  templateUrl: './track.page.html',
  styleUrls: ['./track.page.scss'],
})
export class TrackPage implements OnInit {

  constructor(
    public geo2: Geolocation,
    public activatedRoute: ActivatedRoute,
    public db: AngularFirestore,
    public route: Router,
    public http: HttpClient,
    public plateform: Platform,
  ) { 

    this.activatedRoute.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      if(params['isDelivman'] != undefined){
        this.forDelivman = params['isDelivman'];
        this.forClient = false;
      } 
      console.log('Params1');
      console.log(params);
    });

  }

  public markerShop:any;
  public markerDelivman:any;
  public markerUser:any;
  public forClient:boolean = true;
  public forDelivman:boolean = false;
  public map:any;
  public orderId:any;

  //order
  public order:any;
  public stateValue:any = 0;
  public orderState:boolean = false;
  public pointDeliv: any;
  public pointUser: any;
  public pointShop:any ;

  public coordsShop:any;
  public coordsClient:any;

  public delivmanInfo:any;
  coordinatesToUser:any = [];

  respParsed:any;

  ngOnInit() {

    


        // AccessToken de mapBox
        mapboxgl.accessToken = environment.mapbox.accessToken;

        this.map = new mapboxgl.Map({
          container: 'mapTrack',
          style: 'mapbox://styles/mapbox/streets-v9?optimize=true', // tslint:disable-next-line:no-magic-numbers
          center: [0.3969645,46.2334887], 
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

        that.map.addSource('route', {
          'type': 'geojson',
          'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
          'type': 'LineString',
          'coordinates': []
          }
          }
          });
          that.map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': {
          'line-join': 'round',
          'line-cap': 'round'
          },
          'paint': {
          'line-color': '#048B9A',
          'line-width': 8
          }
          });
        
        let coordinates = that.coordinatesToUser

        

        geolocate.trigger();
        that.mapIsLoading = false;
        that.map.resize();
       });
       console.log('geolocate is')
  
       geolocate.on('geolocate', function(resp) {
        if(that.forDelivman){
      
          // data can be a set of coordinates, or an error (if an error occurred).
          // data.coords.latitude
          // data.coords.longitude
          that.updateGps(resp.coords);
          
        }
        that.respParsed = resp;
          that.startTracking(resp);

       });
  

  }

  startRouteToUser(userCoords){

    let delivCoords = this.respParsed.coords.longitude + ',' + this.respParsed.coords.latitude;

    let url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + delivCoords + ';' + userCoords + '?access_token=pk.eyJ1Ijoic2ltZXJjYSIsImEiOiJjazlueHgzcHkwNHFtM2RtcnAxMmozeW05In0.ki6JAf5xEO_hyrEDZ1mFrA';
 
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

            let result:any = res;

            let coordinates = result.routes[0].geometry;
            console.log('coordinates');
            console.log(coordinates);
            // The API response is GeoJSON which has coordinates in lon/lat order - Leaflet needs lat/lon, so we need to swap them all
            
            //let line = L.dec(coordinates, {color: 'red'}).addTo(this.map);
           let line = L.decode(coordinates);

           var flipped = [];
            for (var i = 0; i < line.length; i++) {
                flipped.push(line[i].slice().reverse());
            }
            console.log(flipped);

            // this.map.jumpTo({ 'center': flipped[0], 'zoom': 15 });

            let geojson:any = {
              'type': 'FeatureCollection',
              'features':[]
            };

            let linestring = {
              'type': 'Feature',
              'geometry': {
              'type': 'LineString',
              'coordinates': flipped
              }
              };

            geojson.features.push(linestring);

            console.log(geojson);

            this.map.getSource('route').setData(geojson);

           this.coordinatesToUser = line;
            
            console.log(line);

            
            

          });
  }

  startRouteToShop(shopCoords){

    let delivCoords = this.respParsed.coords.longitude + ',' + this.respParsed.coords.latitude;

    let url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + delivCoords + ';' + shopCoords + '?access_token=pk.eyJ1Ijoic2ltZXJjYSIsImEiOiJjazlueHgzcHkwNHFtM2RtcnAxMmozeW05In0.ki6JAf5xEO_hyrEDZ1mFrA';
 
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

            let result:any = res;

            let coordinates = result.routes[0].geometry;
            console.log('coordinates');
            console.log(coordinates);
            // The API response is GeoJSON which has coordinates in lon/lat order - Leaflet needs lat/lon, so we need to swap them all
            
            //let line = L.dec(coordinates, {color: 'red'}).addTo(this.map);
           let line = L.decode(coordinates);

           var flipped = [];
            for (var i = 0; i < line.length; i++) {
                flipped.push(line[i].slice().reverse());
            }
            console.log(flipped);

           // this.map.jumpTo({ 'center': flipped[0], 'zoom': 15 });

            let geojson:any = {
              'type': 'FeatureCollection',
              'features':[]
            };

            let linestring = {
              'type': 'Feature',
              'geometry': {
              'type': 'LineString',
              'coordinates': flipped
              }
              };

            geojson.features.push(linestring);

            console.log(geojson);

            this.map.getSource('route').setData(geojson);

           this.coordinatesToUser = line;
            
            console.log(line);

            
            

          });
  }

  startTracking(resp){

      
      // AccessToken de mapBox
      mapboxgl.accessToken = environment.mapbox.accessToken;
  // resp.coords.latitude
  // resp.coords.longitude
  console.log(resp);
  

    


  // Marker to user
  // const point: {} = new mapboxgl.Marker()
  // .setLngLat([resp.coords.longitude, resp.coords.latitude])
  // .addTo(this.map);

  // recuperation de la commande 
  this.db.doc('orders/'+this.orderId).snapshotChanges().subscribe(res=>{
    console.log(res.payload.data());
    let output:any = res.payload.data();
    if(output['state'] == 0){
      this.orderState = false;
      this.stateValue = 0;
    }else if(output['state'] == 1){
      this.orderState = true;
      this.stateValue = 0.5;
    }else if(output['state'] == 2){
      this.orderState = true;
      this.stateValue = 1;
    }
    console.log(this.stateValue);

    var elShop = document.createElement('div');
    elShop.className = 'shopMarker';
    var elDeliv = document.createElement('div');
    elDeliv.className = 'delivMarker';
    var elClient = document.createElement('div');
    elClient.className = 'userMarker';

    // Marker to delivman
      
    if(output['delivmanCoords'] != ""){

      this.delivmanInfo = this.db.doc('users/'+output['delivmanId']).get().subscribe(delivman=>{
        
        this.delivmanInfo = delivman.data();
      });

      try{
        this.pointDeliv.remove();
      }
      catch{

      }

    let delivmanCoordsArray = output['delivmanCoords'].split(',')
      this.pointDeliv = new mapboxgl.Marker(elDeliv)
      .setLngLat({lng:delivmanCoordsArray[0],lat:delivmanCoordsArray[1]})
      .addTo(this.map);
    }


    // Marker to Users
      
    if(output['coordsClient'] != ""){

      try{
        this.pointUser.remove();
      }
      catch{

      }
      this.coordsClient = output['coordsClient'];
      this.startRouteToUser(output['coordsClient']);
    let clientCoordsArray = output['coordsClient'].split(',')
      this.pointUser = new mapboxgl.Marker(elClient)
      .setLngLat({lng:clientCoordsArray[0],lat:clientCoordsArray[1]})
      .addTo(this.map);
    }
    // Marker to shop
    this.coordsShop = output['coordsShop'];
    let shopCoordsArray = output['coordsShop'].split(',')
    this.pointShop = new mapboxgl.Marker(elShop)
    .setLngLat({lng:shopCoordsArray[0],lat:shopCoordsArray[1]})
    .addTo(this.map);


  })



  }




  updateGps(coords){

    console.log('updateGps');

    this.db.doc('orders/'+this.orderId).update({delivmanCoords:coords.longitude+','+coords.latitude});


  }

}
