import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaiementSuccessPage } from './paiement-success.page';

const routes: Routes = [
  {
    path: '',
    component: PaiementSuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaiementSuccessPageRoutingModule {}
