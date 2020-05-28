import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaiementSuccessPageRoutingModule } from './paiement-success-routing.module';

import { PaiementSuccessPage } from './paiement-success.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaiementSuccessPageRoutingModule
  ],
  declarations: [PaiementSuccessPage]
})
export class PaiementSuccessPageModule {}
