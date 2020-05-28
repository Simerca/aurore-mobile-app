import { Component, OnInit } from '@angular/core';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthenticationService } from "../shared/authentication-service";

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.page.html',
  styleUrls: ['./track-list.page.scss'],
})
export class TrackListPage implements OnInit {

  constructor(
    public authService: AuthenticationService,
    public db: AngularFirestore,
  ) { }

  public myOrders:any = [];

  ngOnInit() {
    this.getMyOrders()
  }

  getMyOrders(){

    // console.log(this.authService.userData.uid);
    let userId = "lLOIicPjoQawymGvEx6mLY8SUhy2";
    // let userId = this.authService.userData.uid;
     this.db.collection('orders',query=>query.where('clientId','==',userId)).get().subscribe(resp=>{
      this.myOrders = [];
      console.log(resp);
      resp.forEach(e=>{

        let result = {
          id:e.id,
          state:e.data()['state']
        }

        this.myOrders.push(result);
        
      })

    });

  }

}
