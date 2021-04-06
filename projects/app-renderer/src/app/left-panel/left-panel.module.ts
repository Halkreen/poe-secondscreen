import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftPanelComponent } from './left-panel.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [LeftPanelComponent],
  imports: [CommonModule, MatBadgeModule, MatButtonModule, MatIconModule],
  exports: [LeftPanelComponent],
})
export class LeftPanelModule {}
