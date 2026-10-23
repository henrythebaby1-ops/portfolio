const { app, BrowserWindow, ipcMain, screen, globalShortcut } = require('electron');
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

let mainWindow;
let isTracking = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 620,
    resizable: false,
    frame: false,
    transparent: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: 'HandMouse',
    icon: path.join(__dirname, 'icon.png'),
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register('Escape', () => {
    if (isTracking) {
      mainWindow.webContents.send('stop-tracking');
      isTracking = false;
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') app.quit();
});

// Move the system cursor
ipcMain.on('move-cursor', (event, { x, y }) => {
  try {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const px = Math.round(Math.max(0, Math.min(x, width - 1)));
    const py = Math.round(Math.max(0, Math.min(y, height - 1)));

    if (process.platform === 'darwin') {
      execSync(`osascript -e 'tell application "System Events" to set the position of cursor to {${px}, ${py}}'`);
    } else if (process.platform === 'linux') {
      execSync(`xdotool mousemove ${px} ${py}`);
    } else if (process.platform === 'win32') {
      // Uses a helper script injected at runtime
      execSync(`powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${px}, ${py})"`);
    }
  } catch (e) {
    // Silently ignore if tool not available
  }
});

// Perform a mouse click
ipcMain.on('mouse-click', (event, { button }) => {
  try {
    if (process.platform === 'darwin') {
      execSync(`osascript -e 'tell application "System Events" to click at position of cursor'`);
    } else if (process.platform === 'linux') {
      execSync(`xdotool click ${button === 'right' ? 3 : 1}`);
    } else if (process.platform === 'win32') {
      execSync(`powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('')"`)
    }
  } catch (e) {}
});

// Get screen dimensions
ipcMain.handle('get-screen-size', () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  return { width, height };
});

ipcMain.on('tracking-state', (event, state) => {
  isTracking = state;
});

ipcMain.on('quit-app', () => {
  app.quit();
});

ipcMain.on('minimize-app', () => {
  mainWindow?.minimize();
});
