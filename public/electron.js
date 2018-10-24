const dotenv = require('dotenv');
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

dotenv.load({ path: '.env' });
console.log('process.env.HI');


let mainWindow;

require("update-electron-app")({
  repo: "adamalawrence/blockzeus-desktop",
  updateInterval: "1 hour"
});

app.commandLine.appendSwitch('disable-web-security');
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    transparent: true,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      webSecurity: false
    } 
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
