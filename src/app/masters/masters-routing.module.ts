import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../masters/countries/countries.module').then(m => m.CountriesModule),
  },
  {
    path: 'countries',
    loadChildren: () => import('../masters/countries/countries.module').then(m => m.CountriesModule),
  },
  {
    path: 'cities',
    loadChildren: () => import('../masters/cities/cities.module').then(m => m.CitiesModule),
  },
  {
    path: 'categories',
    loadChildren: () => import('../masters/categories/categories.module').then(m => m.CategoriesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
