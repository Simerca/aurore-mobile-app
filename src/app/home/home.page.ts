import { Component,OnInit } from '@angular/core';
import { AuthenticationService } from "../shared/authentication-service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(
    public authService: AuthenticationService,
    public router: Router
  ) {

    if(this.authService.isLoggedIn){
      this.router.navigate(['dashboard']);  
    }
    
  }

  ngOnInit(){

    

  }


}
