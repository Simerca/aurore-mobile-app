import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordLostPageRoutingModule } from './password-lost-routing.module';

import { PasswordLostPage } from './password-lost.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordLostPageRoutingModule
  ],
  declarations: [PasswordLostPage]
})
export class PasswordLostPageModule {}
