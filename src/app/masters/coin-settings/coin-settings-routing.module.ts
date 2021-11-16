import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinSettingsComponent } from './coin-settings.component';

const routes: Routes = [
  {
    path:'',
    component:CoinSettingsComponent,
    data: {
      title: 'Coin Settings',
      // headerDisplay: "none"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoinSettingsRoutingModule { }
