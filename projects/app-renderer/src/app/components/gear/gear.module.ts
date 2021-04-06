import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GearComponent } from './gear.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [GearComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule],
  exports: [GearComponent],
})
export class GearModule {}
