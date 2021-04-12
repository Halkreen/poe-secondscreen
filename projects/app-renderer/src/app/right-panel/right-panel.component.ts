import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { CharacterModalComponent } from '../components/character-modal/character-modal.component';
import { LevelService } from '../services/level.service';
import { ItemToLookFor } from '../types/itemToLookFor';
import { Notable } from '../types/notable';
import { formatLinks } from '../utils/json-formatter';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPanelComponent implements OnDestroy, OnChanges {
  @Input() public level = 1;
  @Input() public passivePoints = 0;
  @Input() public noData = true;
  @Input() public notableData: Notable[] = [];
  @Input() public items: ItemToLookFor[] = [];

  public levelData = 1;
  public visibleItems: ItemToLookFor[] = [];
  public formatLinks = formatLinks;
  public destroy$: Subject<void> = new Subject<void>();

  public currentNotable: Notable = this.notableData[0];

  constructor(
    private readonly dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef
  ) {}

  public ngOnChanges(): void {
    this.levelData = this.level;
    this.visibleItems = this.items.filter(
      (item) =>
        this.levelData >= item.level &&
        (item.levelMax ? this.levelData <= item.levelMax : true)
    );
    this.cdr.markForCheck();

    if (this.noData && !this.notableData.length) {
      return null;
    }

    let notable = null;

    if (this.passivePoints === 0) {
      this.currentNotable = this.notableData[0];
    }

    for (let i = 0; i < this.notableData.length; i++) {
      if (i === this.notableData.length - 1) {
        notable = this.notableData[0];
        break;
      }
      if (
        this.notableData[i].passivesRequired <= this.passivePoints &&
        this.notableData[i + 1].passivesRequired > this.passivePoints
      ) {
        notable = this.notableData[i + 1];
        break;
      }
    }
    this.currentNotable = notable;

    this.cdr.markForCheck();
  }

  public ngOnDestroy(): void {
    if (this.destroy$) {
      this.destroy$.next();
      this.destroy$ = null;
    }
  }

  public openNameModal(): void {
    this.dialog.open(CharacterModalComponent);
  }
}
