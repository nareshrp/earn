import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponsComponent } from './coupons/coupons.component';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { CommonLayout_ROUTES } from './shared/routes/common-layout.routes';
import { FullLayout_ROUTES } from './shared/routes/full-layout.routes';
import { PublicLayout_ROUTES } from './shared/routes/public-layout.routes';
import { ViewLayout_ROUTES } from './shared/routes/view-layout.routes';

const routes: Routes = [
  {
    path: 'login',
    component: FullLayoutComponent,
    children: FullLayout_ROUTES
  },
  {
    path: '',
    redirectTo: '/dashboard',
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
    path: 'ddp/:id',
    component: PublicLayoutComponent,
    children: PublicLayout_ROUTES
  },
  {
    path: 'views/:id',
    component: CouponsComponent,
    children: ViewLayout_ROUTES
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
