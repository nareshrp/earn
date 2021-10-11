import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDealComponent } from './create-deal/create-deal.component';
import { DealsListComponent } from './deals-list/deals-list.component';

const routes: Routes = [
  {
   path: '',
   component: DealsListComponent,
    data: {
     title: 'Deals List',
     headerDisplay: "none"
   }
  },
  {
    path: 'create-deal',
    component: CreateDealComponent,
     data: {
      title: 'Create Deal',
      headerDisplay: "none"
    }
   },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealsRoutingModule { }
