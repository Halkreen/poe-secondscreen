import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-level-spinner',
  templateUrl: './level-spinner.component.html',
  styleUrls: ['./level-spinner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelSpinnerComponent {
  @Input() public level: number;
}
