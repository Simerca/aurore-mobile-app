import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DelivmanPageRoutingModule } from './delivman-routing.module';

import { DelivmanPage } from './delivman.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DelivmanPageRoutingModule
  ],
  declarations: [DelivmanPage]
})
export class DelivmanPageModule {}
