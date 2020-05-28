import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AuthenticationService } from "./../app/shared/authentication-service";

import { GoogleMaps } from '@ionic-native/google-maps';
import { HttpClientModule } from  '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Options } from './options';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { Firebase } from '@ionic-native/firebase/ngx';

import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';

import { CartModule } from './cart/cart.module';

import { Stripe } from '@ionic-native/stripe/ngx'

import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { ModalPage } from './modal/modal.page';
import { ModalPageModule } from './modal/modal.module';


// FCM
import { FCM } from '@ionic-native/fcm/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    HttpClientModule,
    ModalPageModule, 
    AngularFireDatabaseModule,
    AngularFirestoreModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthenticationService,
    GoogleMaps,
    Options,
    Stripe,
    InAppBrowser,
    Firebase,
    FCM,
    FirebaseAuthentication,
    CartModule,
    PayPal,
    Geolocation,
    AngularFirestoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
