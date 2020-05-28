import { Component, OnInit } from '@angular/core';
import { MapboxServiceService, Feature } from './mapbox-service.service';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import { environment } from 'src/environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.page.html',
  styleUrls: ['./mapbox.page.scss'],
})
export class MapboxPage implements OnInit {

  constructor(
    private mapboxService: MapboxServiceService,
    public geo: Geolocation,
    public activatedRoute: ActivatedRoute,
    public route: Router
    ) {}

  markerTargetLnt: string;
  markerTargetLat: string;

  addresses: string[] = [];
  selectedAddress = null;

  ngOnInit(){

    this.activatedRoute.queryParams.subscribe(params => {
      this.markerTargetLnt = params['lnt'];
      this.markerTargetLat = params['lat'];
      console.log('Params1');
      console.log(params);
    });

    mapboxgl.accessToken = environment.mapbox.accessToken;

    this.geo.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      const map: {} = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9', // tslint:disable-next-line:no-magic-numbers
        center:  [this.markerTargetLnt, this.markerTargetLat],
        zoom: 14
      });

      // Marker to user
      const point: {} = new mapboxgl.Marker()
      .setLngLat([resp.coords.longitude, resp.coords.latitude])
      .addTo(map);
      const pointTarget: {} = new mapboxgl.Marker({
        color:'#BD0000'
      })
      .setLngLat([this.markerTargetLnt, this.markerTargetLat])
      .addTo(map);

     

     }).catch((error) => {
       console.log('Error getting location', error);
     });
    
    
    
  }

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxService
        .search_word(searchTerm)
        .subscribe((features: Feature[]) => {
          this.addresses = features.map(feat => feat.place_name);
        });
      } else {
        this.addresses = [];
      }
  }

  onSelect(address: string) {
    this.selectedAddress = address;
    this.addresses = [];
  }

}
