import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { PagenotFoundComponent } from './layout/pagenotfound/pagenotfound.component';
import { CheckComponent } from './pages/check/check.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [{ path: 'check', component: CheckComponent }]
  },
  { path: '**', component: PagenotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
