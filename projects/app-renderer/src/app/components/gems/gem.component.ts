import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-gem',
  templateUrl: './gem.component.html',
  styleUrls: ['./gem.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GemComponent {
  @Input() public gemName: string;
  @Input() public isNewGem: boolean;
}
