import { Routes, RouterModule } from '@angular/router';

export const ViewLayout_ROUTES: Routes = [
  // {
  //     path: 'authentication',
  //     loadChildren: () => import('../../authentication/authentication.module').then(m => m.AuthenticationModule)
  // },
  {
    path: '',
    loadChildren: () => import('../../coupons/coupons.module').then(m => m.CouponsModule),
  },




];
