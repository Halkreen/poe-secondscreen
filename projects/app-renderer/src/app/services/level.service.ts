import { Injectable, NgZone } from '@angular/core';
import { CustomWindow } from 'my-api';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { State } from '../types/state';

@Injectable({
  providedIn: 'root',
})
export class LevelService {
  private window: CustomWindow;
  private level$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private notable$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  public characterLevel$: Observable<number>;
  public characterNotable$: Observable<number>;

  constructor(
    private readonly zone: NgZone,
    private readonly snackBar: MatSnackBar
  ) {
    this.characterLevel$ = this.level$.asObservable();
    this.characterNotable$ = this.notable$.asObservable();

    this.window = (window as any) as CustomWindow;
    if (this.window.api) {
      this.window.api.onMainMessage((data) => {
        if (data.startsWith('levelsAndNotable: ')) {
          this.setNotablesAndLevels(JSON.parse(data.substring(18)));
        }
      });
    }
  }

  public resetData(): void {
    this.zone.run(() => {
      this.notable$.next(1);
      this.level$.next(1);
    });
  }

  public setNotablesAndLevels(data: State): void {
    this.zone.run(() => {
      if (this.level$.getValue() !== parseInt(data.level, 10)) {
        this.openSnackBar('Level changed');
        this.level$.next(parseInt(data.level, 10));
      }

      if (this.notable$.getValue() !== parseInt(data.passivePoints, 10)) {
        this.openSnackBar('Next notable updated');
        this.notable$.next(parseInt(data.passivePoints, 10));
      }
    });
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(`${message} 👍`, 'Close', {
      duration: 2000,
    });
  }
}
