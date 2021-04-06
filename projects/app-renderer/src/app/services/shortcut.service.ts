import { Injectable, NgZone } from '@angular/core';
import { CustomWindow } from 'my-api';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class LevelService {
  private window: CustomWindow;
  private level$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  public characterLevel$: Observable<number>;

  constructor(
    private readonly zone: NgZone,
    private readonly snackBar: MatSnackBar
  ) {
    this.characterLevel$ = this.level$.asObservable();

    this.window = (window as any) as CustomWindow;
    if (this.window.api) {
      this.window.api.onMainMessage(() => {
        this.levelUp();
      });
    }
  }

  public levelUp(): void {
    this.zone.run(() => {
      const currentLevel = this.level$.getValue();
      if (currentLevel === 100) {
        return;
      }
      this.level$.next(currentLevel + 1);
      this.openSnackBar();
    });
  }

  public openSnackBar(): void {
    this.snackBar.open('Level Up 👍', 'Close', {
      duration: 2000,
    });
  }
}
