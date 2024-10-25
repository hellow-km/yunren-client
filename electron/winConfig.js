const path = require("path");
const ICO_PATH = path.join(__dirname, "logo.ico");
const winConfig = {
  width: 1080,
  height: 700,
  minWidth: 800,
  minHeight: 580,
  show: false,
  resizable: true,
  maximizable: true,
  fullscreenable: true,
  icon: ICO_PATH,
  center: true,
  titleBarStyle: "hidden",
  title: "云任工具",
  backgroundColor: "#fff",
  //MAC_OS
  simpleFullscreen: true,
  //no border
  frame: false,
  webPreferences: {
    preload: path.join(__dirname, "preload.js"),
    contextIsolation: true,
    nodeIntegration: true,
    enableRemoteModule: false,
    webviewTag: true,
  },
};

const loadingWinConfig = {
  width: 300,
  height: 300,
  minWidth: 300,
  minHeight: 300,
  show: true,
  resizable: false,
  maximizable: false,
  fullscreenable: false,
  alwaysOnTop: true,
  center: true,
  skipTaskbar: true,
  titleBarStyle: "hidden",
  title: "云任工具",
  frame: false, // 无边框窗口
  transparent: true, // 透明窗口
  //MAC_OS
  simpleFullscreen: false,
  //no border
  frame: false,
  webPreferences: {
    contextIsolation: false,
    nodeIntegration: false,
    enableRemoteModule: false,
    webviewTag: false,
  },
};

const petWinConfig = {
  width: 300,
  height: 300,
  minWidth: 300,
  minHeight: 300,
  show: true,
  skipTaskbar: true,
  resizable: false,
  maximizable: false,
  fullscreenable: false,
  alwaysOnTop: true,
  center: false,
  titleBarStyle: "hidden",
  title: "云任工具",
  frame: false, // 无边框窗口
  transparent: true, // 透明窗口
  //MAC_OS
  simpleFullscreen: false,
  //no border
  frame: false,
  webPreferences: {
    preload: path.join(__dirname, "preload_pet.js"),
    contextIsolation: true,
    nodeIntegration: true,
    enableRemoteModule: false,
    webviewTag: true,
  },
};

const topWinConfig = {
  width: 150,
  height: 100,
  minWidth: 150,
  minHeight: 100,
  show: true,
  skipTaskbar: true,
  resizable: false,
  maximizable: false,
  fullscreenable: false,
  alwaysOnTop: false,
  center: false,
  titleBarStyle: "hidden",
  title: "云任工具",
  frame: false, // 无边框窗口
  transparent: false, // 透明窗口
  //MAC_OS
  simpleFullscreen: true,
  webPreferences: {
    preload: path.join(__dirname, "preload_top.js"),
    contextIsolation: true,
    nodeIntegration: true,
    enableRemoteModule: false,
    webviewTag: true,
  },
};

module.exports = {
  winConfig,
  loadingWinConfig,
  petWinConfig,
  topWinConfig,
};
