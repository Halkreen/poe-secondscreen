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

  private dataSubject$: BehaviorSubject<CharactersData> =
    new BehaviorSubject<CharactersData>(null);
  public data$: Observable<CharactersData>;

  private classSubject$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  public class$: Observable<string>;

  public filePath = '';

  constructor(
    private readonly zone: NgZone,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {
    this.data$ = this.dataSubject$.asObservable();

    this.window = window as any as CustomWindow;
    if (this.window.api) {
      this.window.api.onMainMessage((data) => {
        if (data.startsWith('levelingData: ')) {
          this.setData(
            JSON.parse(data.substring(14).split(' || ')[0]),
            data.substring(14).split(' || ')[1]
          );
        }
      });
    }
  }

  public openDialog(
    characterName: string,
    filePath: string,
    className: string
  ): void {
    if (this.window.api) {
      const client = this.setFilePath(filePath);
      this.window.api.sendToMain(
        'openDialog ' + characterName + ' || ' + client + ' || ' + className
      );
    }
  }

  public setData(data: CharactersData, className: string): void {
    this.zone.run(() => {
      this.dialog.closeAll();
      this.dataSubject$.next(data);
      this.classSubject$.next(className);
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
