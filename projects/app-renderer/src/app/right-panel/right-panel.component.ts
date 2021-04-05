import { Component, NgZone, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { LevelService } from '../services/shortcut.service';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css'],
})
export class RightPanelComponent {
  public readonly level$: Observable<number> = this.levelService.characterLevel$.pipe(
    distinctUntilChanged()
  );

  constructor(private readonly levelService: LevelService) {}
}
