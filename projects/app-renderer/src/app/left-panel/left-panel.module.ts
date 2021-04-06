import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftPanelComponent } from './left-panel.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GearModule } from '../components/gear/gear.module';
import { LevelCarouselModule } from '../components/level-carousel/level-carousel.module';

@NgModule({
  declarations: [LeftPanelComponent],
  imports: [
    CommonModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    GearModule,
    LevelCarouselModule,
  ],
  exports: [LeftPanelComponent],
})
export class LeftPanelModule {}
