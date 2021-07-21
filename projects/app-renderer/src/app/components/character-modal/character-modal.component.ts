import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '../../services/dialog.service';
import { PobService } from '../../services/pob.service';

@Component({
  selector: 'app-character-modal',
  templateUrl: 'character-modal.component.html',
  styles: [
    `
      .separator {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .separator-text {
        text-align: center;
      }
    `,
  ],
})
export class CharacterModalComponent implements OnInit {
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public thirdFormGroup: FormGroup;
  public isEditable = false;

  constructor(
    private readonly dialogService: DialogService,
    private readonly formBuilder: FormBuilder,
    private readonly pobService: PobService
  ) {}

  public ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9-_]+$'),
          Validators.maxLength(24),
        ]),
      ],
      classCtrl: ['', Validators.compose([Validators.required])],
    });

    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.compose([Validators.required])],
    });

    this.thirdFormGroup = this.formBuilder.group({
      pobCtrl: ['', Validators.pattern(/https:\/\/pastebin.com\/\w+/)],
    });

    const filePath = localStorage.getItem('filePath');
    if (filePath !== '') {
      this.secondFormGroup.get('secondCtrl').setValue(filePath);
    }
  }

  public openDialog(): void {
    this.dialogService.openDialog(
      this.firstFormGroup.get('firstCtrl').value,
      this.secondFormGroup.get('secondCtrl').value,
      this.firstFormGroup.get('classCtrl').value
    );
  }

  public openAndSendPoB(): void {
    if (this.thirdFormGroup.get('pobCtrl').errors) {
      return;
    }
    this.pobService.parsePob(
      this.thirdFormGroup.get('pobCtrl').value as string,
      this.firstFormGroup.get('firstCtrl').value,
      this.secondFormGroup.get('secondCtrl').value,
      this.firstFormGroup.get('classCtrl').value
    );
  }
}
