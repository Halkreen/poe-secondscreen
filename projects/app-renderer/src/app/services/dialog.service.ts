import { Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  public filePath = '';

  constructor(
    private readonly zone: NgZone,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
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

  public openDialog(characterName: string, filePath: string): void {
    if (this.window.api) {
      const client = this.setFilePath(filePath);
      this.window.api.sendToMain(
        'openDialog ' + characterName + ' || ' + client
      );
    }
  }

  public setData(data: CharactersData): void {
    this.zone.run(() => {
      this.dialog.closeAll();
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

  private setFilePath(path: string): string {
    if (localStorage.getItem('filePath') !== path) {
      localStorage.setItem('filePath', path);
    }
    return path;
  }
}
