import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { AuthenticationService } from "../shared/authentication-service";


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  public account:any = {};

  constructor(
    public db: AngularFirestore,
    public auth: AuthenticationService
  ) { }

  ngOnInit() {
  
    this.db.doc('users/'+this.auth.userData.uid).get().subscribe(user=>{
      console.log(user.data())
      this.account.Email = user.data()['Email'];
      this.account.FirstName = user.data()['FirstName'];
      this.account.LastName = user.data()['LastName'];
      this.account.Phone = user.data()['Phone'];
      this.account.AddressLine1 = user.data()['Address']['AddressLine1'];
      this.account.PostalCode = user.data()['Address']['PostalCode'];
      this.account.City = user.data()['Address']['City'];

    });
  
  }



  updateAccount(email,address,codePostal,firstName,lastName,city,phone,addressLine2){

    console.log(email.value);

    this.db.collection('users', res => res.where('Email','==', email.value)).snapshotChanges().subscribe(datas => {

      datas.map(e => {
        console.log(email.value);
        console.log(e.payload.doc.id);
        let userId = e.payload.doc.id;
        this.db.doc('users/'+userId).update({
          Address:{
            AddressLine1:address.value,
            AddressLine2:addressLine2.value,
            City:city.value,
            PostalCode:codePostal.value,
          },
          Phone:phone.value,
          FirstName:firstName.value,
          LastName:lastName.value
        })
      })

    });

  }

}
