import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorsListComponent } from './vendors-list.component';

const routes: Routes = [
  {
    path: '',
    component: VendorsListComponent,
    data: {
      title: 'Vendors List ',
      // headerDisplay: "none"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsListRoutingModule { }
