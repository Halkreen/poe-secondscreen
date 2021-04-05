import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftPanelComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
