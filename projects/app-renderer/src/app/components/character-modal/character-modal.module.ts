import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { CharacterModalComponent } from './character-modal.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    MatStepperModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  declarations: [CharacterModalComponent],
  exports: [CharacterModalComponent],
  providers: [DialogService],
})
export class CharacterModalModule {}
