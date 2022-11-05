import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthChildGuard } from './guards/authchild.guard';
import { LayoutComponent } from './layout/layout.component';
import { PagenotFoundComponent } from './layout/pagenotfound/pagenotfound.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: LayoutComponent, children: [
      { path: '', component: HomeComponent }
    ]
  },
  {
    path: '', component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthChildGuard],
    children: [
      { path: 'check', loadChildren: () => import('./pages/check/check.module').then(m => m.CheckModule) },
      { path: 'maintenance', loadChildren: () => import('./pages/maintenance/maintenance.module').then(m => m.MaintenanceModule) },
      { path: 'assignment', loadChildren: () => import('./pages/assignment/assignment.module').then(m => m.AssignmentModule) },
      { path: 'scoring', loadChildren: () => import('./pages/scoring/scoring.module').then(m => m.ScoringModule) },
      { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
    ]
  },
  { path: '**', component: PagenotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
