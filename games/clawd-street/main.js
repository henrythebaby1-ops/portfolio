const { app, BrowserWindow, ipcMain, screen } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function loadAppConfig() {
  const configPath = path.join(__dirname, 'app-config.json');
  const fallback = {
    productName: 'Clawd Street',
    windowTitle: 'Clawd Street',
    iconPath: 'build/icon.png'
  };

  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

const appConfig = loadAppConfig();

function clampToScreen(x, y) {
  const bounds = mainWindow.getBounds();
  const workArea = screen.getDisplayNearestPoint({ x, y }).workArea;

  const maxX = workArea.x + workArea.width - bounds.width;
  const maxY = workArea.y + workArea.height - bounds.height;

  return {
    x: Math.max(workArea.x, Math.min(x, maxX)),
    y: Math.max(workArea.y, Math.min(y, maxY))
  };
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    transparent: false,
    frame: true,
    resizable: true,
    hasShadow: true,
    alwaysOnTop: false,
    skipTaskbar: false,
    fullscreenable: true,
    backgroundColor: '#120b07',
    title: appConfig.windowTitle,
    icon: path.join(__dirname, appConfig.iconPath),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  const primary = screen.getPrimaryDisplay().workArea;
  const startX = Math.floor(primary.x + (primary.width - 1240) / 2);
  const startY = Math.floor(primary.y + (primary.height - 820) / 2);
  mainWindow.setPosition(startX, startY);
}

app.whenReady().then(() => {
  app.setName(appConfig.productName);
  createWindow();

  ipcMain.handle('pet:get-environment', () => {
    const [x, y] = mainWindow.getPosition();
    const bounds = mainWindow.getBounds();
    const workArea = screen.getDisplayMatching(bounds).workArea;

    return {
      position: { x, y },
      windowSize: { width: bounds.width, height: bounds.height },
      workArea
    };
  });

  ipcMain.handle('pet:move-to', (_, nextX, nextY) => {
    if (!mainWindow) {
      return;
    }

    const clamped = clampToScreen(Math.round(nextX), Math.round(nextY));
    mainWindow.setPosition(clamped.x, clamped.y);
    return clamped;
  });

  ipcMain.on('pet:set-interactive', (_, interactive) => {
    if (!mainWindow) {
      return;
    }

    mainWindow.setIgnoreMouseEvents(!interactive);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
