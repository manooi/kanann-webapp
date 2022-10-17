import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoringComponent } from './scoring.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { EditScoreComponent } from './edit-score/edit-score.component';
import { ScoringService } from 'src/app/shared/service/api/scoring.service';

const routes: Routes = [
  { path: '', component: ScoringComponent },
  { path: 'edit', component: EditScoreComponent }
];

@NgModule({
  declarations: [
    ScoringComponent,
    EditScoreComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule
  ],
  providers: [ScoringService]
})
export class ScoringModule { }
