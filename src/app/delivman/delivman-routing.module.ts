import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DelivmanPage } from './delivman.page';

const routes: Routes = [
  {
    path: '',
    component: DelivmanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DelivmanPageRoutingModule {}
