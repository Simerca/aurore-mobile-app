import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordLostPage } from './password-lost.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordLostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordLostPageRoutingModule {}
