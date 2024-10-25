const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  net,
  Tray,
  screen,
  protocol,
} = require("electron");

const path = require("path");
const fs = require("fs");
const { ipcMain } = require("electron");
const os = require("os");
const { spawn } = require("child_process");
const packageJSON = require("./package.json");
const DEV_ENV = app.isPackaged;

const ICO_PATH = path.join(__dirname, "logo.ico");
const DOWNFILE_PATH = os.homedir() + "\\Desktop";

const { winConfig, loadingWinConfig, petWinConfig } = require("./winConfig");
const { onCreateTopWin } = require("./createWindow");
const {
  startDownload,
  pauseDownload,
  resumeDownload,
  cancelDownload,
  deleteDownload,
} = require("./download");
const { getTempFolder, saveDownloadsPath } = require("./utils");

const version = packageJSON.version;
let win = null;
let tray = null;
let process = null;
let petWin = null;
const gotAppLock = app.requestSingleInstanceLock();

let loadingWin;
function startAnimation() {
  loadingWin = new BrowserWindow(loadingWinConfig);
  loadingWin.loadFile(path.join(__dirname, "loading.html"));
}

function netConn() {
  // return false
  const isNet = net.isOnline();

  global.dirname = __dirname;
  if (app.isPackaged) {
    // let devPath = path.join(__dirname, "dist/index.html")
    // win.loadFile(devPath)
    win.loadURL("https://www.yunren.online/electron/" + version + "/");
  } else {
    // win.loadURL("https://www.yunren.online/electron/" + version + "/");
    win.loadURL("http://127.0.0.1:9000");
  }
}

// 创建浏览器窗口
function createWindow() {
  //启动动画
  startAnimation();
  win = win != null ? win.show() : new BrowserWindow(winConfig);

  // 窗口工具条移除
  Menu.setApplicationMenu(null);

  win.on("ready-to-show", () => {
    try {
      loadingWin.destroy();
      loadingWin = null;
    } catch (e) {
      console.log("close", e);
    }

    win.show();
    win.focus();
  });

  netConn();
  tray = new Tray(ICO_PATH);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "退出",
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    if (win) {
      try {
        win.show();
      } catch (e) {}
    }
  });

  win.webContents.on("did-finish-load", () => {
    win.webContents.send("sendDirName", DOWNFILE_PATH);
  });

  win.on("resize", () => {
    let size = win.getContentBounds();
    win.webContents.send("resizeWin", JSON.stringify(size));
  });

  win.on("closed", () => {
    win = null;
  });

  win.on("focus", () => {
    win.webContents.send("focus-window");
  });

  win.on("maximize", () => {
    win.webContents.send("change-max", true);
  });

  win.on("unmaximize", () => {
    win.webContents.send("change-max", false);
  });
  // win.webContents.openDevTools();

  // ipcMain.on("reconnection", () => {
  //   netConn();
  // });

  // 自定义关闭、缩放按钮
  ipcMain.on("min", () => win.minimize());

  ipcMain.on("max", () => {
    // win.isMaximized() ? win.unmaximize() : win.maximize()
    win.maximize();
  });

  ipcMain.on("resetWindow", () => {
    win.unmaximize();
  });

  ipcMain.on("close", (e) => {
    win.hide();
    win.setSkipTaskbar(true);
    e.preventDefault();
    e.reply("close-app-finish");
  });

  ipcMain.on("startDownload", (e, row) => {
    startDownload(row, e);
  });

  ipcMain.on("pauseDownload", (e, row) => {
    pauseDownload(row, e);
  });

  ipcMain.on("cancelDownload", (e, row) => {
    cancelDownload(row, e);
  });

  ipcMain.on("resumeDownload", (e, row) => {
    resumeDownload(row, e);
  });

  ipcMain.on("deleteDownload", (e, row) => {
    deleteDownload(row, e);
  });

  ipcMain.on("saveDownloads", (e, jsonData) => {
    fs.writeFileSync(saveDownloadsPath, jsonData);
  });

  ipcMain.on("closeApp", (e) => {
    win.destroy();
    win = null;

    e.reply("close-app-finish");
  });

  ipcMain.on("show-win", () => {
    win.show();
  });

  ipcMain.on("openPet", () => {
    onCreatePetWin();
  });

  ipcMain.on("openTop", () => {
    onCreateTopWin();
  });

  ipcMain.on("closePet", () => {
    try {
      petWin.destroy();
      petWin = null;
    } catch (e) {}
  });

  ipcMain.on("hide-win", () => {
    win.hide();
  });
  ipcMain.on("remove-tray", () => {
    if (tray != null) {
      tray.destroy();
      tray = null;
    }
  });

  ipcMain.on("focus-window", () => {
    win.focus();
  });
  // 测试环境快捷键
  // if (!DEV_ENV) {
  globalShortcut.register("Alt+F12", () => {
    win.webContents.openDevTools();
  });
  // }
}

function onCreatePetWin() {
  if (petWin != null) {
    petWin.focus();
    return;
  }
  petWin = new BrowserWindow(petWinConfig);
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  petWin.setPosition(width - petWinConfig.width, height - petWinConfig.height);

  petWin.on("closed", () => {
    petWin = null;
  });

  if (app.isPackaged) {
    petWin.loadURL("https://www.yunren.online/electron/" + version + "/");
  } else {
    petWin.webContents.openDevTools();
    petWin.loadURL("http://localhost:9000/");
  }
}

//单窗口处理
if (!gotAppLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    // @retrun: event, commandLine, workingDirectory
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
  app.on("ready", createWindow);
}

// 当全部窗口关闭时退出。
app.on("window-all-closed", () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  try {
    app.quit();
  } catch (e) {
    console.log("process.platform", e);
  }
});

app.on("activate", () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow();
  }
});
