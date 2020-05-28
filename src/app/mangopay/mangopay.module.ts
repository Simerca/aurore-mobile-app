import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MangopayPageRoutingModule } from './mangopay-routing.module';

import { MangopayPage } from './mangopay.page';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MangopayPageRoutingModule
  ],
  declarations: [MangopayPage]
})
export class MangopayPageModule {


 

}
