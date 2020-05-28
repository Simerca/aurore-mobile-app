import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaiementErrorPage } from './paiement-error.page';

const routes: Routes = [
  {
    path: '',
    component: PaiementErrorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaiementErrorPageRoutingModule {}
