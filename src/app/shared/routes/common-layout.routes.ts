import { Routes } from '@angular/router';
import { AuthenticationGuard } from '../services/authentication.guard';

export const CommonLayout_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'masters',
    loadChildren: () => import('../../masters/masters.module').then(m => m.MastersModule),
    canActivate: [AuthenticationGuard],
  },
 
  {
    path: 'vendors',
    loadChildren: () => import('../../vendors-list/vendors-list.module').then(m => m.VendorsListModule),
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'deals',
    loadChildren: () => import('../../deals/deals.module').then(m => m.DealsModule),
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'coupon-validation',
    loadChildren: () => import('../../coupon-validation/coupon-validation.module').then(m => m.CouponValidationModule),
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'questions',
    loadChildren: () => import('../../questions/questions.module').then(m => m.QuestionsModule),
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'notification',
    loadChildren: () => import('../../appnotifications/appnotifications.module').then(m => m.AppnotificationsModule),
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'users',
    loadChildren: () => import('../../users/users.module').then(m => m.UsersModule),
    canActivate: [AuthenticationGuard],
  },
];
