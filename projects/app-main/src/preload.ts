import { contextBridge, ipcRenderer } from 'electron';
import { API } from './api';

const api: API = {
    sendToMain: (message) => {
        ipcRenderer.send('messageFromRenderer', message);
    },
    onMainMessage: (fn) => {
        ipcRenderer.on('messageFromMain', (event, message) => fn(message));
    },
};

contextBridge.exposeInMainWorld('api', api);
