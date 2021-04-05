import { join } from 'path';
import { app, BrowserWindow, globalShortcut } from 'electron';
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


    // ipcMain.on('messageFromRenderer', (event, message) => {
    //     console.log('Received message from renderer:', message);
    //     win.webContents.send('messageFromMain', 'This is a message from main!');
    // });
    globalShortcut.register('Alt+CommandOrControl+I', () => {
        win.webContents.send('messageFromMain', 'dummy message');
    });

    win.loadURL('file://' + (process.platform === 'win32' ? '/' : '') + join(__dirname, '../renderer/index.html').replace(/\\/g, '/'));

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
