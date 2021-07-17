import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-character-modal',
  templateUrl: 'character-modal.component.html',
})
export class CharacterModalComponent implements OnInit {
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public isEditable = false;

  constructor(
    private readonly dialogService: DialogService,
    private formBuilder: FormBuilder
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
}
