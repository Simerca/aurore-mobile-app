import { Component, OnInit } from '@angular/core';
import { MangopayPageModule } from './mangopay.module'

import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';



@Component({
  selector: 'app-mangopay',
  templateUrl: './mangopay.page.html',
  styleUrls: ['./mangopay.page.scss'],
})
export class MangopayPage implements OnInit {

  constructor(
    public http: HttpClient,
    private iab: InAppBrowser

  ) { }

  public clientId:string = 'joudiapp';
  public apiKey:string = 'eFH2EHhBeFWi3t4SgTkFjTLYkgLKa49jEm4ZTnMraKefFYA9k4';
  public url:string = 'https://api.sandbox.mangopay.com';
  public userMangopayId:any;
  public userWalletMangopayId:any;
  public PreregistrationData:any;
  public AccessKey:any;
  public cardRegistrationUrl:any;
  public cardRegistrationId:any;
  public cardData:any = "data=nyE9OPhlGammVS88Gn2dO067tUwE02GohVAxSjN7nwKD_QoTxcHrgr2v6bZ4zeJhfZ3NxN-9M5oENQL3K2qkZ1_7HntAY8IiQDZnWhnFBfrufO0iSDQk1PM3RMWazlQG_uh-M22NjZ6dU5YsJBBYuA";
  public cardId:any;


  ngOnInit() {


  }

  createUser(){

    const headers = new HttpHeaders()
              .set('content-type', 'application/json')
              .set('Authorization', 'Basic '+btoa(this.clientId+':'+this.apiKey))

              console.log(btoa(this.clientId+':'+this.apiKey));
              
              let body = {
                "FirstName": "Joe",
                "LastName": "Blogs",
                "Address": {
                "AddressLine1": "1 Mangopay Street",
                "AddressLine2": "The Loop",
                "City": "Paris",
                "PostalCode": "75001",
                "Country": "FR"
                },
                "Birthday": 1463496101,
                "Nationality": "GB",
                "CountryOfResidence": "FR",
                "Email": "support@mangopay.com"
                }

          this.http.post(this.url+'/v2.01/'+this.clientId+'/users/natural/',body, { headers: headers }).subscribe(res => {

            let result:any = res;
            console.log(res);
            this.userMangopayId = result.Id;
              
          });

  }

  createWallet(){

    

      const headers = new HttpHeaders()
              .set('content-type', 'application/json')
              .set('Authorization', 'Basic '+btoa(this.clientId+':'+this.apiKey))

              console.log(btoa(this.clientId+':'+this.apiKey));
              
              let body = {
                "Owners": [ this.userMangopayId ],
                "Description": "My big project",
                "Currency": "EUR",
                "Tag": "custom meta"
                }

          this.http.post(this.url+'/v2.01/'+this.clientId+'/wallets/',body, { headers: headers }).subscribe(res => {

            let result:any = res;
            console.log(res);
            this.userWalletMangopayId = result.Id;
              
          });

  }

  cardRegistration(){

    const headers = new HttpHeaders()
              .set('content-type', 'application/json')
              .set('Authorization', 'Basic '+btoa(this.clientId+':'+this.apiKey))

              console.log(btoa(this.clientId+':'+this.apiKey));
              
              let body = {
                "UserId": this.userMangopayId,
                "Currency": "EUR",
                "CardType": "CB_VISA_MASTERCARD"
                }

          this.http.post(this.url+'/v2.01/'+this.clientId+'/cardregistrations/',body, { headers: headers }).subscribe(res => {

            let result:any = res;
            console.log(res);
            console.log(result.PreregistrationData);
            this.PreregistrationData = result.PreregistrationData;
            console.log(result.AccessKey);
            this.AccessKey = result.AccessKey;
            this.cardRegistrationId = result.Id;
            this.cardRegistrationUrl = result.CardRegistrationURL
              
          });

  }

  saveCard(){

    

    var data = new FormData();
    data.append('data', this.PreregistrationData);
    data.append('accessKeyRef', this.AccessKey);
    data.append('cardNumber', '4970104100876588');
    data.append('cardExpirationDate', '1023');
    data.append('cardCvx', '102');

    console.log(this.PreregistrationData);
    console.log(this.AccessKey);

    let body3 = new URLSearchParams();
      body3.set('data', this.PreregistrationData);
      body3.set('accessKeyRef', this.AccessKey);
      body3.set('cardNumber', '4970104100876588');
      body3.set('cardExpirationDate', '1023');
      body3.set('cardCvx', '102');

    const headers = new HttpHeaders()
              .set('content-type', 'application/x-www-form-urlencoded')

          this.http.post(this.cardRegistrationUrl,body3.toString(), { headers: headers }).subscribe(res => {
            console.log(res);
            this.cardData = res;
          },error=>{
            console.log(error)
            this.cardData = error.error.text;
          });

  }

  putCardData(){

    const headers = new HttpHeaders()
              .set('content-type', 'application/json')
              .set('Authorization', 'Basic '+btoa(this.clientId+':'+this.apiKey))

              console.log(btoa(this.clientId+':'+this.apiKey));
              
              let body = {
                "RegistrationData": this.cardData
                }

          this.http.put(this.url+'/v2.01/'+this.clientId+'/CardRegistrations/'+this.cardRegistrationId,body, { headers: headers }).subscribe(res => {

            let result:any = res;
            this.cardId = result.CardId
            console.log(res);
              
          });

  }

  createPayInWeb(){

    const headers = new HttpHeaders()
              .set('content-type', 'application/json')
              .set('Authorization', 'Basic '+btoa(this.clientId+':'+this.apiKey))

              console.log(btoa(this.clientId+':'+this.apiKey));
              
              let body = {
                  "Tag": "custom meta",
                  "AuthorId": this.userMangopayId,
                  "DebitedFunds": {
                  "Currency": "EUR",
                  "Amount": 12
                  },
                  "Fees": {
                  "Currency": "EUR",
                  "Amount": 5
                  },
                  "ReturnURL": "http://www.my-site.com/returnURL/",
                  "CardType": "CB_VISA_MASTERCARD",
                  "CreditedWalletId": "80053900",
                  "SecureMode": "DEFAULT",
                  "Culture": "EN",
                  "TemplateURLOptions": {
                  "Payline": "https://www.mysite.com/template/",
                  "PaylineV2": "https://www.mysite.com/template/"
                  },
                  "StatementDescriptor": "Mar2016"
                  }

          this.http.post(this.url+'/v2.01/'+this.clientId+'/payins/card/direct/',body, { headers: headers }).subscribe(res => {

            console.log(res);

        });

      }

  createDirectPayIn(){

    const headers = new HttpHeaders()
              .set('content-type', 'application/json')
              .set('Authorization', 'Basic '+btoa(this.clientId+':'+this.apiKey))

              console.log(btoa(this.clientId+':'+this.apiKey));
              
              let body =  {
                    "AuthorId": this.userMangopayId,
                    "CreditedUserId": "80054171",
                    "CreditedWalletId": "80054172",
                    "DebitedFunds": {
                    "Currency": "EUR",
                    "Amount": 12200
                    },
                    "Fees": {
                    "Currency": "EUR",
                    "Amount": 12
                    },
                    "SecureModeReturnURL": "http://www.my-site.com/returnURL",
                    "CardId": this.cardId,
                    "SecureMode": "DEFAULT",
                    "Billing": {
                    "Address": {
                    "AddressLine1": "1 Mangopay Street",
                    "AddressLine2": "The Loop",
                    "City": "Paris",
                    "Region": "Ile de France",
                    "PostalCode": "75001",
                    "Country": "FR"
                    }
                    },
                    "StatementDescriptor": "Mar2016",
                    "Culture": "EN",
                    "Tag": "Custom description for this specific PayIn"
                    }

          this.http.post(this.url+'/v2.01/'+this.clientId+'/payins/card/direct/',body, { headers: headers }).subscribe(res => {

            console.log(res);
            let result:any = res;

            const iosoption: InAppBrowserOptions = {
              zoom: 'no',
              location:'yes',
              toolbar:'yes',
              clearcache: 'yes',
              clearsessioncache: 'yes',
              disallowoverscroll: 'yes',
              enableViewportScale: 'yes'
            }

            const browser = this.iab.create(result.SecureModeRedirectURL, '_blank', iosoption);

        });

      }

}
