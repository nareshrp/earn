import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinsComponent } from './coins.component';

const routes: Routes = [{
  path: '',
  component: CoinsComponent,
  data: {
    title: 'Coins',
    // headerDisplay: "none"
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoinsRoutingModule { }
