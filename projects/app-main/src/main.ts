import { app, BrowserWindow } from 'electron';
import { PoeSecondScreen } from './poe-secondscreen';

let main: PoeSecondScreen = null;
let processExited = false;

app.whenReady().then(() => {
  main = new PoeSecondScreen();
  main.createProcess();
});

app.on('window-all-closed', () => {
  processExited = true;
  main.stopPeriodicFlushing();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    main = new PoeSecondScreen();
    main.createProcess();
  }
});
