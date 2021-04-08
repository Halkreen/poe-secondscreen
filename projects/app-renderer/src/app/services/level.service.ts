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
      });
    }
  }

  public nextNotable(): void {
    this.zone.run(() => {
      const currentNotable = this.notable$.getValue();
      this.notable$.next(currentNotable + 1);
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
      this.openSnackBar('Level up');
    });
  }

  public resetData(): void {
    this.notable$.next(1);
    this.level$.next(1);
  }

  public openSnackBar(message: string): void {
    this.snackBar.open(`${message} 👍`, 'Close', {
      duration: 2000,
    });
  }
}
