import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MangopayPage } from './mangopay.page';

const routes: Routes = [
  {
    path: '',
    component: MangopayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MangopayPageRoutingModule {}
