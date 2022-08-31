import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DatabaseComponent } from './database/database.component';
import { UserAndRoleComponent } from './user-and-role/user-and-role.component';

const routes: Routes = [
  {
    path: 'database', component: DatabaseComponent,
  },
  { path: 'users-and-roles', component: UserAndRoleComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes), 
    SharedModule,
    MaterialModule
  ],
  declarations: [DatabaseComponent, UserAndRoleComponent],
  exports: [RouterModule]
})
export class MaintenanceModule { }
