import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAuthGuard } from './guards/myauth.guard';
import { LayoutComponent } from './layout/layout.component';
import { PagenotFoundComponent } from './layout/pagenotfound/pagenotfound.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent,
    data: { id: '0' },
    canActivate: [MyAuthGuard],
    canActivateChild: [MyAuthGuard],
    children: [
      { path: 'maintenance', data: { id: '1' }, loadChildren: () => import('./pages/maintenance/maintenance.module').then(m => m.MaintenanceModule) },
      { path: 'check', data: { id: '2' }, loadChildren: () => import('./pages/check/check.module').then(m => m.CheckModule) },
      { path: 'rfid', data: { id: '3' }, loadChildren: () => import('./pages/rfid/rfid.module').then(m => m.RfidModule) },
      { path: 'assignment', data: { id: '4' }, loadChildren: () => import('./pages/assignment/assignment.module').then(m => m.AssignmentModule) },
      { path: 'scoring', data: { id: '5' }, loadChildren: () => import('./pages/scoring/scoring.module').then(m => m.ScoringModule) },
      { path: 'dashboard', data: { id: '6' }, loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'student', data: { id: '7,8' }, loadChildren: () => import('./pages/student/student.module').then(m => m.StudentModule) },
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
