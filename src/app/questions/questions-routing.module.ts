import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionslistComponent } from './questionslist/questionslist.component';

const routes: Routes = [
  {
    path:'',
    component:QuestionslistComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionsRoutingModule { }
