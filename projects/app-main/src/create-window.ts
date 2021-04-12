import { BrowserWindow } from 'electron';
import { join } from 'path';
import { environment } from './environments/environment';

export function createWindow(): BrowserWindow {
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
