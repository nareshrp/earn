import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { CommonLayout_ROUTES } from './shared/routes/common-layout.routes';
import { FullLayout_ROUTES } from './shared/routes/full-layout.routes';
import { PublicLayout_ROUTES } from './shared/routes/public-layout.routes';

const routes: Routes = [
  {
    path: 'login',
    component: FullLayoutComponent,
    children: FullLayout_ROUTES
  },
  {
    path: '',
    redirectTo: '/dashboard/home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: CommonLayoutComponent,
    children: CommonLayout_ROUTES
  },
  {
    path: 'user',
    component: FullLayoutComponent,
    children: FullLayout_ROUTES
  },
  {
    path: 'vendor',
    component: FullLayoutComponent,
    children: FullLayout_ROUTES
  },
  {
    path: 'coupon/:id',
    component: PublicLayoutComponent,
    children: PublicLayout_ROUTES
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
