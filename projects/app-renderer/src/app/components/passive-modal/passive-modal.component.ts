import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-passive-modal',
  templateUrl: 'passive-modal.component.html',
  styleUrls: ['./passive-modal.component.css'],
})
export class PassiveModalComponent implements OnInit {
  public svgContent = null;
  public masteryData = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tree: string; mastery: any[] },
    private readonly sanitizer: DomSanitizer
  ) {}

  public ngOnInit(): void {
    this.svgContent = this.sanitizer.bypassSecurityTrustHtml(this.data.tree);
    this.masteryData = this.data.mastery;
  }
}
