import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RightPanelComponent } from './right-panel.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [RightPanelComponent],
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule],
  exports: [RightPanelComponent],
})
export class RightPanelModule {}
