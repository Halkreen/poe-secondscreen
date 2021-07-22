import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  public questUsedSubject = new BehaviorSubject<
    { name: string; quest: string }[]
  >([]);
  public questUsed = this.questUsedSubject.asObservable();

  constructor(private readonly cdr: ChangeDetectorRef) {}

  public newQuestUsed(event: { name: string; quest: string }): void {
    if (event?.name && event?.quest) {
      this.questUsedSubject.next([...this.questUsedSubject.getValue(), event]);
    }
  }
}
