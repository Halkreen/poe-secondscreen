import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Gear } from '../types/gear';
import { formatGems, formatLinks } from '../utils/json-formatter';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftPanelComponent {
  @Input() public gear: Gear[];

  public formatLinks = formatLinks;
  public formatGems = formatGems;
}
