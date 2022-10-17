import { NgModule } from '@angular/core';
import { CheckComponent } from './check.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { RouterModule, Routes } from '@angular/router';
import { ClassComponent } from './class/class.component';

const routes: Routes = [
  { path: '', component: CheckComponent },
  { path: 'view', children: [{ path: ':id', component: ClassComponent, data: { isEdit: false } }] },
  { path: 'edit', children: [{ path: ':id', component: ClassComponent }], data: { isEdit: true } },
];

@NgModule({
  declarations: [
    CheckComponent,
    ClassComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule
  ],
  exports: [RouterModule],
})
export class CheckModule { }
