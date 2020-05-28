import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackListPageRoutingModule } from './track-list-routing.module';

import { TrackListPage } from './track-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackListPageRoutingModule
  ],
  declarations: [TrackListPage]
})
export class TrackListPageModule {}
