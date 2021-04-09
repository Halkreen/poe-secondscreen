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
        if (data === 'levelUp') {
          this.levelUp();
        }
        if (data === 'nextNotable') {
          this.nextNotable();
        }
        if (data.startsWith('levelsAndNotable: ')) {
          this.setNotablesAndLevels(JSON.parse(data.substring(18)));
        }
      });
    }
  }

  public nextNotable(): void {
    this.zone.run(() => {
      const currentNotable = this.notable$.getValue();
      this.notable$.next(currentNotable + 1);
      this.saveState();
      this.openSnackBar('Next notable updated');
    });
  }

  public levelUp(): void {
    this.zone.run(() => {
      const currentLevel = this.level$.getValue();
      if (currentLevel === 100) {
        return;
      }
      this.level$.next(currentLevel + 1);
      this.saveState();
      this.openSnackBar('Level up');
    });
  }

  public resetData(): void {
    this.notable$.next(1);
    this.level$.next(1);
    this.saveState();
  }

  public setNotablesAndLevels(data: State): void {
    this.level$.next(data.level);
    this.notable$.next(data.notable);
  }

  public openSnackBar(message: string): void {
    this.snackBar.open(`${message} 👍`, 'Close', {
      duration: 2000,
    });
  }

  public saveState(): void {
    const state: State = {
      level: this.level$.getValue(),
      notable: this.notable$.getValue(),
    };
    if (this.window.api) {
      this.window.api.sendToMain('saveState ' + JSON.stringify(state));
    }
  }
}
