import { join } from 'path';
import { readFile } from 'fs';
import { app, BrowserWindow, globalShortcut, ipcMain, dialog } from 'electron';
import { environment } from './environments/environment';
import Store = require('electron-store');

let queue = [];

function processJson(
  win: BrowserWindow,
  path: string,
  levelingData: { notable: number; level: number } = null,
  persist: boolean = false
): void {
  readFile(path, 'utf-8', (err, data) => {
    if (err) {
      win.webContents.send('messageFromMain', 'err: ' + err.message);
      return;
    }

    if (persist) {
      store.set('data.path', path);
    }

    // No need to wait in this case, app is ready
    if (!levelingData) {
      win.webContents.send('messageFromMain', 'levelingData: ' + data);
      return;
    }
    sendDataInQueue(data, JSON.stringify(levelingData));
  });
}

function sendDataInQueue(data: string, levelingData: string): void {
  queue = [
    {
      channel: 'messageFromMain',
      message: 'levelingData: ' + data,
    },
    {
      channel: 'messageFromMain',
      message: 'levelsAndNotable: ' + levelingData,
    },
  ];
}

function flushQueue(win: BrowserWindow): void {
  queue.forEach((action) => {
    win.webContents.send(action.channel, action.message);
  });
  queue = [];
}

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.maximize();
  win.show();

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

    if (message === 'applicationReady') {
      flushQueue(win);
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
