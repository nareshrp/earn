import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppnotificationlistComponent } from './appnotificationlist/appnotificationlist.component';

const routes: Routes = [{
  path:'',
  component:AppnotificationlistComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppnotificationsRoutingModule { }
