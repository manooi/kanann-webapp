import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAuthGuard } from './guards/myauth.guard';
import { LayoutComponent } from './layout/layout.component';
import { PagenotFoundComponent } from './layout/pagenotfound/pagenotfound.component';
import { LoginComponent } from './pages/login/login.component';
import { RfidComponent } from './pages/rfid/rfid/rfid.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'rfid', loadChildren: () => import('./pages/rfid/rfid.module').then(m => m.RfidModule) },
  {
    path: '', component: LayoutComponent,
    canActivate: [MyAuthGuard],
    canActivateChild: [MyAuthGuard],
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
  // imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
