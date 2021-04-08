import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogService } from '../services/dialog.service';
import { LevelService } from '../services/level.service';
import { Notable } from '../types/notable';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPanelComponent {
  @Input() public level = 1;
  @Input() public noData = true;
  @Input() public notableData: Notable[] = [];

  public readonly notable$: Observable<Notable | null> = this.levelService.characterNotable$.pipe(
    map((notableOrder: number) => {
      if (this.noData && this.notableData) {
        return null;
      }
      return this.notableData.find((notable) => notable.order === notableOrder);
    })
  );

  constructor(
    private readonly dialogService: DialogService,
    private readonly levelService: LevelService
  ) {}

  public openDialog(): void {
    this.dialogService.openDialog();
  }
}
