import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackListPage } from './track-list.page';

const routes: Routes = [
  {
    path: '',
    component: TrackListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackListPageRoutingModule {}
