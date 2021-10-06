import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSignupComponent } from './user-signup.component';

const routes: Routes = [
  {
    path: '',
    component: UserSignupComponent,
    data: {
      title: 'User Signup'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSignupRoutingModule { }
