import { Routes } from '@angular/router';
import { AuthenticationGuard } from '../services/authentication.guard';

export const CommonLayout_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthenticationGuard],

  }
];
