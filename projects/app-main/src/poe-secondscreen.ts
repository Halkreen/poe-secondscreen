import { BrowserWindow, globalShortcut, ipcMain, dialog } from 'electron';
import { readFile } from 'fs';
import { createWindow } from './create-window';
import { Watcher } from './watcher';
import Store = require('electron-store');

export class PoeSecondScreen {
  public store: Store = new Store();
  public queue: any[] = [];
  public win: BrowserWindow = null;
  public watcher: Watcher = new Watcher();
  public characterName: string = null;
  public timerId = null;

  constructor() {
    this.startMessageCatching();
  }

  // Queue methods

  private startPeriodicFlushing(): void {
    console.log('Flushing process started');
    this.timerId = setInterval(() => {
      const shouldResetQueue = this.flushQueue(this.queue);
      if (shouldResetQueue) {
        this.resetQueue();
      }
    }, 1500);
  }

  public resetQueue(): void {
    this.queue = [];
  }

  public stopPeriodicFlushing(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  public flushQueue(queue: any[]): boolean {
    if (queue && queue.length) {
      queue.forEach((action) => {
        this.win.webContents.send(action.channel, action.message);
      });
      console.log('Flushed ' + queue.length + ' message(s)');
      return true;
    }
    return false;
  }

  private sendDataInQueue(...messages: string[]): void {
    messages.forEach((message) => {
      this.queue.push({
        channel: 'messageFromMain',
        message,
      });
    });
  }

  // Init data methods

  public createProcess(): void {
    this.win = createWindow();

    globalShortcut.register('Alt+CommandOrControl+L', () => {
      this.win.webContents.send('messageFromMain', 'levelUp');
    });

    globalShortcut.register('Alt+CommandOrControl+P', () => {
      this.win.webContents.send('messageFromMain', 'nextNotable');
    });

    const lastCharacter = this.store.get('data.lastCharacter');
    if (lastCharacter && this.store.get('data.' + lastCharacter)) {
      this.watcher.startWatcher(
        'C:/Program Files (x86)/Steam/steamapps/common/Path of Exile/logs/client.txt',
        lastCharacter as string,
        (characterName: string, newLevel: number) =>
          this.onPassivePointsUp(characterName, newLevel),
        (characterName: string, newLevel: number) =>
          this.onLevelUp(characterName, newLevel)
      );
      this.importData(this.store.get('data.' + lastCharacter));
    }
  }

  private importData(store: any): void {
    const stored = store as {
      file: string;
      level: number;
      passivePoints: number;
    };

    readFile(stored.file, 'utf-8', (err, data) => {
      if (err) {
        this.sendDataInQueue('err: ' + err.message);
        return;
      }

      this.sendDataInQueue(
        'levelingData: ' + data,
        'levelsAndNotable: ' +
          JSON.stringify({
            passivePoints: stored.passivePoints,
            level: stored.level,
          })
      );
    });
  }

  // Event catching methods

  private afterLoad(err: any, data: string, path: string): void {
    if (err) {
      this.sendDataInQueue('err: ' + err.message);
      return;
    }

    this.store.set(`data.lastCharacter`, this.characterName);
    this.store.set(`data.${this.characterName}.file`, path);
    this.store.set(`data.${this.characterName}.level`, 1);
    this.store.set(`data.${this.characterName}.passivePoints`, 0);
    this.store.set(`data.${this.characterName}.extraPassivePoints`, 0);

    console.log('Data loaded for ' + this.characterName + ' at ' + path);
    this.watcher.stopWatcher();
    this.watcher.startWatcher(
      'C:/Program Files (x86)/Steam/steamapps/common/Path of Exile/logs/client.txt',
      this.characterName,
      (char, level) => this.onPassivePointsUp(char, level),
      (char, increment) => this.onLevelUp(char, increment)
    );
    this.sendDataInQueue('levelingData: ' + data);
    console.log('Data sent in queue');
  }

  private startMessageCatching(): void {
    ipcMain.on('messageFromRenderer', (_, message) => {
      if (message.startsWith('openDialog ')) {
        const characterName = (message as string).split(' ')[1];

        if (!characterName.length) {
          return;
        }
        this.characterName = characterName;

        const pathToJson = dialog.showOpenDialogSync(this.win, {
          properties: ['openFile'],
          filters: [{ name: 'JSON files', extensions: ['json'] }],
        });

        if (pathToJson && pathToJson[0]) {
          readFile(pathToJson[0], 'utf-8', (err, data) =>
            this.afterLoad(err, data, pathToJson[0])
          );
        }
      }

      if (message === 'applicationReady') {
        this.startPeriodicFlushing();
      }
    });
  }

  // on action methods

  private onLevelUp(characterName: string, newLevel: number): void {
    if (!newLevel || !characterName) {
      return;
    }

    this.store.set(`data.${characterName}.level`, newLevel.toString());
    this.store.set(
      `data.${characterName}.passivePoints`,
      (newLevel - 1).toString()
    );

    const currentExtraPassives = this.store.get(
      `data.${characterName}.extraPassivePoints`
    ) as string;

    this.sendDataInQueue(
      'levelsAndNotable: ' +
        JSON.stringify({
          passivePoints: newLevel - 1 + parseInt(currentExtraPassives, 10),
          level: newLevel,
        })
    );
  }

  private onPassivePointsUp(characterName: string, increment: number): void {
    if (!increment || !characterName) {
      return;
    }

    const currentLevel = this.store.get(`data.${characterName}.level`);
    const currentPassives = this.store.get(
      `data.${characterName}.passivePoints`
    ) as string;
    const currentExtraPassives = this.store.get(
      `data.${characterName}.extraPassivePoints`
    ) as string;

    if (currentExtraPassives) {
      this.store.set(
        `data.${characterName}.extraPassivePoints`,
        parseInt(currentExtraPassives as string, 10) + increment
      );
    }

    this.sendDataInQueue(
      'levelsAndNotable: ' +
        JSON.stringify({
          passivePoints:
            parseInt(currentPassives, 10) + parseInt(currentExtraPassives, 10),
          level: currentLevel,
        })
    );
  }
}
