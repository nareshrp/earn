import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorSignupComponent } from './vendor-signup.component';

const routes: Routes = [
  {
    path: '',
    component: VendorSignupComponent,
    data: {
      title: 'Vendor Signup'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorSignupRoutingModule { }
