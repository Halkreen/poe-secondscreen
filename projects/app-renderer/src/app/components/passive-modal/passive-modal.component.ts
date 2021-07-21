import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-passive-modal',
  templateUrl: 'passive-modal.component.html',
  styles: [],
})
export class PassiveModalComponent implements OnInit {
  public svgContent = null;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private readonly sanitizer: DomSanitizer
  ) {}

  public ngOnInit(): void {
    this.svgContent = this.sanitizer.bypassSecurityTrustHtml(this.data);
  }
}
