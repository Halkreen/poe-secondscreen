import { join } from 'path';
import { readFile } from 'fs';
import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  dialog,
  remote,
} from 'electron';
import { environment } from './environments/environment';
import Store = require('electron-store');

function processJson(
  win: BrowserWindow,
  path: string,
  levelingData: { notable: number; level: number } = null,
  persist: boolean = false
): void {
  readFile(path, 'utf-8', (err, data) => {
    let timeout = 0;
    if (err) {
      win.webContents.send('messageFromMain', 'err: ' + err.message);
      return;
    }

    if (persist) {
      store.set('data.path', path);
    } else {
      timeout = 3000;
    }
    setTimeout(() => {
      // TODO: This is bad. I need to send an event when the renderer is ready,
      // and then flush the pending commands to the renderer
      win.webContents.send('messageFromMain', 'levelingData: ' + data);
      if (levelingData) {
        win.webContents.send(
          'messageFromMain',
          'levelsAndNotable: ' + JSON.stringify(levelingData)
        );
      }
    }, timeout);
  });
}

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  ipcMain.on('messageFromRenderer', (event, message) => {
    if (message === 'openDialog') {
      const pathToJson = dialog.showOpenDialogSync(win, {
        properties: ['openFile'],
        filters: [{ name: 'JSON File', extensions: ['json'] }],
      });

      if (pathToJson && pathToJson[0]) {
        processJson(win, pathToJson[0], null, true);
      }
    }

    if (message.startsWith('saveState ')) {
      const jsonData = JSON.parse(message.substring(10));

      if (jsonData.level) {
        store.set('data.level', jsonData.level);
      }

      if (jsonData.notable) {
        store.set('data.notable', jsonData.notable);
      }
    }
  });

  globalShortcut.register('Alt+CommandOrControl+L', () => {
    win.webContents.send('messageFromMain', 'levelUp');
  });

  globalShortcut.register('Alt+CommandOrControl+P', () => {
    win.webContents.send('messageFromMain', 'nextNotable');
  });

  win.loadURL(
    'file://' +
      (process.platform === 'win32' ? '/' : '') +
      join(__dirname, '../renderer/index.html').replace(/\\/g, '/')
  );

  if (environment.production) {
    win.removeMenu();
  } else {
    win.webContents.openDevTools();
  }

  return win;
}

function createProcess(): void {
  const win = createWindow();
  const storedObj = store.get('data');
  if (Object.keys(storedObj).includes('path')) {
    const stored = storedObj as {
      path: string;
      notable: number;
      level: number;
    };
    processJson(
      win,
      stored.path,
      {
        notable: stored.notable,
        level: stored.level,
      },
      false
    );
  }
}

const store = new Store();

app.whenReady().then(createProcess);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createProcess();
  }
});
