import { Component, OnInit } from '@angular/core';

import { HttpClient, HttpHeaders} from '@angular/common/http';


/* Import all of the required Google Maps entities from the google-maps package */
import { LocationService,PolylineOptions, Polyline, ILatLng, GoogleMaps, GoogleMapsEvent, LatLng, MarkerOptions, Marker, Environment, MyLocation,MyLocationOptions, GoogleMapOptions } from "@ionic-native/google-maps";

import { Platform } from "@ionic/angular";

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {


  constructor(
    public platform: Platform,
    private http: HttpClient
    ) { }

	/* Only instantiate the map AFTER the view is initialized and the DOM is accessible */
	ngAfterViewInit() {
		this.platform.ready().then(() => this.loadMap());
	}


	loadMap() {
    /* The create() function will take the ID of your map element */
    Environment.setEnv({
      API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyBtiyDQNViZoF5amrEo8i4teehzboG8a0s',
      API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyBtiyDQNViZoF5amrEo8i4teehzboG8a0s'
    });

    let optionsLocation: MyLocationOptions = {
      enableHighAccuracy: true
    };
    LocationService.getMyLocation(optionsLocation).then((myLocation: MyLocation) => {

      let options: GoogleMapOptions = {
        camera: {
          target: myLocation.latLng,
          zoom: 12,
          tilt: 30
        },
      };

    const map = GoogleMaps.create('map',options);

    let markerOptions: MarkerOptions = {
      position: myLocation.latLng
    }
      map.addMarker(markerOptions).then((marker: Marker) => {

    });

    let HND_AIR_PORT: ILatLng = myLocation.latLng;
    let HNL_AIR_PORT: ILatLng = {lat: 44.7950679, lng: -0.5352855};

    // Calcul D itineraire :

      let postData = {
              "name": "Customer004",
              "email": "customer004@email.com",
              "tel": "0000252525"
      }

      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
      };

      this.http.post("https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=AIzaSyBtiyDQNViZoF5amrEo8i4teehzboG8a0s", postData,httpOptions)
        .subscribe(data => {
          console.log(data['_body']);
        }, error => {
          console.log(error);
        });

      // Calcul d itineraire
    let AIR_PORTS: ILatLng[] = [
      HND_AIR_PORT,
      HNL_AIR_PORT
    ];
    let optionsPolyline: PolylineOptions = {
      points: AIR_PORTS,
      color: '#AA00FF',
      width: 10,
      geodesic: true,
      clickable: true
    };

    map.addPolyline(optionsPolyline).then((polyline: Polyline) => {
      
    });

    // map.one( GoogleMapsEvent.MAP_READY ).then((data: any) => {
		// 	const coordinates: LatLng = new LatLng(41, -87);

		// 	map.setCameraTarget(coordinates);
		// 	map.setCameraZoom(8);
    // });
    
    });

	
  }
  
  ngOnInit() {

    

  }

}
