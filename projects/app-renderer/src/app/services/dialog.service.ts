import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomWindow } from 'my-api';
import { BehaviorSubject, Observable } from 'rxjs';
import { CharactersData } from '../types/character-data';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private window: CustomWindow;

  private dataSubject$: BehaviorSubject<CharactersData> = new BehaviorSubject<CharactersData>(
    null
  );
  public data$: Observable<CharactersData>;

  constructor(
    private readonly zone: NgZone,
    private readonly snackBar: MatSnackBar
  ) {
    this.data$ = this.dataSubject$.asObservable();

    this.window = (window as any) as CustomWindow;
    if (this.window.api) {
      this.window.api.onMainMessage((data) => {
        if (data.startsWith('levelingData: ')) {
          this.setData(JSON.parse(data.substring(14)));
        }
      });
    }
  }

  public openDialog(): void {
    if (this.window.api) {
      this.window.api.sendToMain('openDialog');
    }
  }

  public setData(data: CharactersData): void {
    this.zone.run(() => {
      this.dataSubject$.next(data);
      this.openSnackBar();
    });
  }

  public openSnackBar(): void {
    this.snackBar.open('Data imported / retrieved 👍', 'Close', {
      duration: 2000,
    });
  }

  public sendApplicationReady(): void {
    if (this.window.api) {
      this.window.api.sendToMain('applicationReady');
    }
  }
}
