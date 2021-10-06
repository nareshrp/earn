import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {
      title: 'Login'
    },
  },
  {
    path: 'signup',
    loadChildren: () => import('../authentication/user-signup/user-signup.module').then(m => m.UserSignupModule),
  },
  {
    path: 'vendor',
    loadChildren: () => import('../authentication/vendor/vendor.module').then(m => m.VendorModule),
  },
  {
    path: 'vendor-signup',
    loadChildren: () => import('../authentication/vendor/vendor.module').then(m => m.VendorModule),
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
