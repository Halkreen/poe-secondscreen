import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RightPanelComponent } from './right-panel.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { LevelService } from '../services/level.service';
import { DialogService } from '../services/dialog.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [RightPanelComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSnackBarModule,
    MatButtonModule,
  ],
  exports: [RightPanelComponent],
  providers: [LevelService, DialogService],
})
export class RightPanelModule {}
