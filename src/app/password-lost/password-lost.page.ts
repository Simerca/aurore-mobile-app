import { Component, OnInit } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from "@angular/fire/auth";
import * as firebase from "firebase";
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-password-lost',
  templateUrl: './password-lost.page.html',
  styleUrls: ['./password-lost.page.scss'],
})
export class PasswordLostPage implements OnInit {

  public isSend: boolean = false;
  public isError: boolean = false;

  constructor(

    public afAuth: AngularFireAuth,
    public db: AngularFirestore

  ) { }

  ngOnInit() {
  }

  resetPass(email:any){
    this.isSend = false;
    let result = this.afAuth.auth.sendPasswordResetEmail(email.value, 
      { url: 'http://localhost:8100/auth' }).then(e=>{
        this.isSend = true;
        this.isError = false;
      }).catch(error=>{
        this.isError = true;
        console.log(error.message);
      });
      console.log(result);
  }

}
