import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from "../shared/authentication-service";
import { AngularFirestore } from "@angular/fire/firestore"
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})

export class RegistrationPage implements OnInit {

  constructor(
    public authService: AuthenticationService,
    public db: AngularFirestore,
    public router: Router,
    public http: HttpClient
  ) { }

  public userMangopayId:any;
  public clientId:string = 'joudiapp';
  public apiKey:string = 'eFH2EHhBeFWi3t4SgTkFjTLYkgLKa49jEm4ZTnMraKefFYA9k4';
  public url:string = 'https://api.sandbox.mangopay.com';
  public userForm:any = {};
  public userWalletMangopayId:any;

  ngOnInit(){}

  signUp(email, password){
      this.authService.RegisterUser(email.value, password.value)
      .then((res) => {
        // Do something here
        
        console.log(res);
        console.log(res.user.uid);

          const headers = new HttpHeaders()
                    .set('content-type', 'application/json')
                    .set('Authorization', 'Basic '+btoa(this.clientId+':'+this.apiKey))
                    let body = {
                      "FirstName": this.userForm.FirstName,
                      "LastName": this.userForm.LastName,
                      "Address": {
                      "AddressLine1": this.userForm.AddressLine1,
                      "AddressLine2": this.userForm.AddressLine2,
                      "City": this.userForm.City,
                      "PostalCode": this.userForm.PostalCode,
                      "Country": "FR"
                      },
                      "Birthday": 1463496101,
                      "Nationality": "GB",
                      "CountryOfResidence": "FR",
                      "Email": email.value,
                      mangoPayId:0,
                      walletId:0
                      }
      
                this.http.post(this.url+'/v2.01/'+this.clientId+'/users/natural/',body, { headers: headers }).subscribe(postData => {
                  let result:any = postData;
                  this.userMangopayId = result.Id;
                  body.mangoPayId = this.userMangopayId;
                    const headers = new HttpHeaders()
                    .set('content-type', 'application/json')
                    .set('Authorization', 'Basic '+btoa(this.clientId+':'+this.apiKey))
                    
                    let bodyWallet = {
                      "Owners": [ this.userMangopayId ],
                      "Description": "Client Wallet",
                      "Currency": "EUR",
                      "Tag": "custom meta"
                      }
      
                this.http.post(this.url+'/v2.01/'+this.clientId+'/wallets/',bodyWallet, { headers: headers }).subscribe(walletData => {
      
                  let result:any = walletData;
                  this.userWalletMangopayId = result.Id;
                  body.walletId = this.userWalletMangopayId;
                  this.db.doc('users/'+res.user.uid).set(body);
                  this.authService.SendVerificationMail()
                    
                });
                });

        
        // this.router.navigate(['verify-email']);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

}