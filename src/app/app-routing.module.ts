import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { PagenotFoundComponent } from './layout/pagenotfound/pagenotfound.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'check', loadChildren: () => import('./pages/check/check.module').then(m => m.CheckModule) },
      { path: 'maintenance', loadChildren: () => import('./pages/maintenance/maintenance.module').then(m => m.MaintenanceModule) },
      { path: 'assignment', loadChildren: () => import('./pages/assignment/assignment.module').then(m => m.AssignmentModule) },
      { path: 'scoring', loadChildren: () => import('./pages/scoring/scoring.module').then(m => m.ScoringModule) }
    ]
  },
  { path: '**', component: PagenotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
