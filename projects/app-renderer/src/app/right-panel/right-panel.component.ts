import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogService } from '../services/dialog.service';
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
export class RightPanelComponent implements OnChanges {
  @Input() public level = 1;
  @Input() public noData = true;
  @Input() public notableData: Notable[] = [];
  @Input() public items: ItemToLookFor[] = [];

  public visibleItems: ItemToLookFor[] = [];
  public formatLinks = formatLinks;

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

  public ngOnChanges(): void {
    this.visibleItems = this.items.filter(
      (item) =>
        this.level >= item.level &&
        (item.levelMax ? this.level <= item.levelMax : true)
    );
  }

  public openDialog(): void {
    this.dialogService.openDialog();
  }
}
