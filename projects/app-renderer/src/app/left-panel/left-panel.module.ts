import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftPanelComponent } from './left-panel.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GearModule } from '../components/gear/gear.module';

@NgModule({
  declarations: [LeftPanelComponent],
  imports: [
    CommonModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    GearModule,
  ],
  exports: [LeftPanelComponent],
})
export class LeftPanelModule {}
