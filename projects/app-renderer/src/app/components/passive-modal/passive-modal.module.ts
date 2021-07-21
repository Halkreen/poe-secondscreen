import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PassiveModalComponent } from './passive-modal.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PassiveModalComponent],
  exports: [PassiveModalComponent],
})
export class PassiveModalModule {}
