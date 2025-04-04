const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'), // Подключаем renderer.js
      nodeIntegration: true, // Разрешаем использовать Node.js в интерфейсе
      contextIsolation: false // Упрощаем доступ к API Electron
    }
  });

  win.loadFile('index.html'); // Загружаем интерфейс
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});