import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Gem } from '../../types/gem';

@Component({
  selector: 'app-gem',
  templateUrl: './gem.component.html',
  styleUrls: ['./gem.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GemComponent {
  @Input() public gem: Gem;
}
