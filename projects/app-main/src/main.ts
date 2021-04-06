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

console.log('Running production build:', environment.production);

function createWindow(): void {
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
        readFile(pathToJson[0], 'utf-8', (err, data) => {
          if (err) {
            win.webContents.send('messageFromMain', 'err: ' + err.message);
            return;
          }

          win.webContents.send('messageFromMain', 'levelingData: ' + data);
        });
      }
    }
  });

  globalShortcut.register('Alt+CommandOrControl+I', () => {
    win.webContents.send('messageFromMain', 'levelUp');
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
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
