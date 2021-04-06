import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LevelingData } from '../types/leveling-data';
import {
  findGearPiece,
  formatGems,
  formatLinks,
} from '../utils/json-formatter';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftPanelComponent {
  @Input() public currentStep: LevelingData;
  @Input() public previousStep: LevelingData;
  @Input() public levelThresholds: number[];
  @Input() public level: number;

  public formatLinks = formatLinks;
  public formatGems = formatGems;
  public findGearPiece = findGearPiece;
}
