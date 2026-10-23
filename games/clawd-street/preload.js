const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('petAPI', {
  getEnvironment: () => ipcRenderer.invoke('pet:get-environment'),
  moveTo: (x, y) => ipcRenderer.invoke('pet:move-to', x, y),
  setInteractive: (interactive) => ipcRenderer.send('pet:set-interactive', interactive)
});
