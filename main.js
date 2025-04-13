const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const DiscordRPC = require('discord-rpc');

const clientId = '1360655969964658788';
DiscordRPC.register(clientId);
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

async function setDiscordRPC() {
  try {
    await rpc.login({ clientId });
    rpc.setActivity({
      details: '😈 UruFinder',
      state: '✨ El Mejor Finder de Minecraft',
      startTimestamp: Date.now(),
      largeImageKey: 'urufinder',
      largeImageText: 'UruFinder v1.2 ✨',
      smallImageKey: 'urufinder',
      smallImageText: '(.gg/urufinder)',
    });
  } catch (error) {
    console.error('Error', error);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    resizable: true,
    fullscreen: false,
    fullscreenable: true,
    icon: path.join(__dirname, 'img2', 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  Menu.setApplicationMenu(null);
  win.loadFile('login.html');
}

app.whenReady().then(() => {
  setDiscordRPC();
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

// Eventos del auto-updater
autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Actualización disponible',
    message: 'Hay una nueva versión disponible. Se descargará en segundo plano.',
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Actualización lista',
    message: 'Se descargó la nueva versión. La app se reiniciará para aplicar la actualización.',
  }).then(() => {
    autoUpdater.quitAndInstall();
  });
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
