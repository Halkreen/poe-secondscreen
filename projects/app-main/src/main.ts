import { join } from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { environment } from './environments/environment';

console.log('Running production build:', environment.production);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // TODO: customize to your needs:
    ipcMain.on('messageFromRenderer', (event, message) => {
        console.log('Received message from renderer:', message);
        win.webContents.send('messageFromMain', 'This is a message from main!');
    });
    win.loadURL('file://' + (process.platform === 'win32' ? '/' : '') + join(__dirname, '../renderer/index.html').replace(/\\/g, '/'));
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
