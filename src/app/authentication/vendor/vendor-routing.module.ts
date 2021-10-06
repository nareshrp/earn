import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VendorSignupComponent } from './vendor-signup/vendor-signup.component';

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
    loadChildren: () => import('./vendor-signup/vendor-signup.module').then(m => m.VendorSignupModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
