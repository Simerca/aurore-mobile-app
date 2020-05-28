import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  navigate : any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.sideMenu();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // subscribe to a topic
      // this.fcm.subscribeToTopic('Deals');

      

    });


     

  }

  sideMenu()
  {
    this.navigate =
    [
      {
        title : "Recherchez",
        url   : "/dashboard",
        icon  : "home"
      },
      {
        title : "Mon compte",
        url   : "/account",
        icon  : "chatboxes"
      },
      {
        title : "Assistance",
        url   : "/support",
        icon  : "contacts"
      },
      {
        title : "Livreur",
        url   : "/delivman",
        icon  : "contacts"
      },
      {
        title : "Mes commandes",
        url   : "/track-list",
        icon  : "contacts"
      },
    ]
  }
}
