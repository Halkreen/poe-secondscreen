import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { DialogService } from '../services/dialog.service';
import { LevelService } from '../services/level.service';
import { LevelingData } from '../types/leveling-data';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPanelComponent {
  public readonly level$: Observable<number> = this.levelService.characterLevel$.pipe(
    distinctUntilChanged()
  );

  constructor(
    private readonly dialogService: DialogService,
    private readonly levelService: LevelService
  ) {}

  public openDialog(): void {
    this.dialogService.openDialog();
  }
}
