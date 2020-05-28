import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'confirm-order',
    loadChildren: () => import('./confirm-order/confirm-order.module').then( m => m.ConfirmOrderPageModule)
  },
  {
    path: 'paiement-success',
    loadChildren: () => import('./paiement-success/paiement-success.module').then( m => m.PaiementSuccessPageModule)
  },
  {
    path: 'paiement-error',
    loadChildren: () => import('./paiement-error/paiement-error.module').then( m => m.PaiementErrorPageModule)
  },
  {
    path: 'mapbox',
    loadChildren: () => import('./mapbox/mapbox.module').then( m => m.MapboxPageModule)
  },
  {
    path: 'sos',
    loadChildren: () => import('./sos/sos.module').then( m => m.SosPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: 'password-lost',
    loadChildren: () => import('./password-lost/password-lost.module').then( m => m.PasswordLostPageModule)
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule)
  },
  {
    path: 'track',
    loadChildren: () => import('./track/track.module').then( m => m.TrackPageModule)
  },
  {
    path: 'delivman',
    loadChildren: () => import('./delivman/delivman.module').then( m => m.DelivmanPageModule)
  },
  {
    path: 'mangopay',
    loadChildren: () => import('./mangopay/mangopay.module').then( m => m.MangopayPageModule)
  },
  {
    path: 'track-list',
    loadChildren: () => import('./track-list/track-list.module').then( m => m.TrackListPageModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then( m => m.SupportPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }