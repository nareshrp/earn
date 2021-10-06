import { Routes, RouterModule } from '@angular/router';

export const FullLayout_ROUTES: Routes = [
  // {
  //     path: 'authentication',
  //     loadChildren: () => import('../../authentication/authentication.module').then(m => m.AuthenticationModule)
  // },
  {
    path: '',
    loadChildren: () => import('../../authentication/authentication.module').then(m => m.AuthenticationModule),
  },
  {
    path: 'signup',
    loadChildren: () => import('../../authentication/user-signup/user-signup.module').then(m => m.UserSignupModule),
  },
  {
    path: 'login',
    loadChildren: () => import('../../authentication/vendor/vendor.module').then(m => m.VendorModule),
  },
  {
    path: 'vendor-signup',
    loadChildren: () => import('../../authentication/vendor/vendor-signup/vendor-signup.module').then(m => m.VendorSignupModule),

  },
  // {
  //   path: 'vendor-signup',
  //   redirectTo: '/vendor/vendor-signup/signup',
  //   pathMatch: 'full',
  // },


];
