import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaiementErrorPageRoutingModule } from './paiement-error-routing.module';

import { PaiementErrorPage } from './paiement-error.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaiementErrorPageRoutingModule
  ],
  declarations: [PaiementErrorPage]
})
export class PaiementErrorPageModule {}
