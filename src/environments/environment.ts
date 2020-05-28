// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { pluginWarn } from '@ionic-native/core/decorators/common';

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyAFxvLeqdHSYKuApnWLdIwvfxbjFPyg7tc",
    authDomain: "ineed-2241f.firebaseapp.com",
    databaseURL: "https://ineed-2241f.firebaseio.com",
    projectId: "ineed-2241f",
    storageBucket: "ineed-2241f.appspot.com",
    messagingSenderId: "165847455608",
    appId: "1:165847455608:web:770130653bb0120158da8d",
    measurementId: "G-PWXPFF7XL9"
  },
  mapbox : {
        accessToken : "pk.eyJ1Ijoic2ltZXJjYSIsImEiOiJjazlueHgzcHkwNHFtM2RtcnAxMmozeW05In0.ki6JAf5xEO_hyrEDZ1mFrA"
      }


};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
