import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from '../reports/users/users.component';


const routes: Routes = [{
  path:'',
  component:UsersComponent,
  data: {
    title: 'Users Report',

  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
