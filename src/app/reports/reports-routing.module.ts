import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from '../reports/users/users.component';
import { TransactionComponent } from './transaction/transaction.component';


const routes: Routes = [
  {
  path:'',
  component:UsersComponent,
  data: {
    title: 'Users Report',

  }
},
{
  path:'transaction',
  component:TransactionComponent,
  data: {
    title: 'Transaction',

  }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
