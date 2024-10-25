const { BrowserWindow, app, ipcMain, globalShortcut } = require("electron");
const { topWinConfig } = require("./winConfig");
const { execFile, execFileSync, exec } = require("child_process");
const path = require("path");
let topWin = null;
const packageJSON = require("./package.json");
const isPackaged = () => {
  const execPath = process.execPath;
  return execPath.includes("yunren_tools.exe");
};
const mainPath = isPackaged()
  ? path.join(__dirname, "../")
  : path.join(__dirname);

let toTopExe = null;
function onCreateTopWin() {
  if (topWin != null) {
    topWin.focus();
    return;
  }
  topWin = new BrowserWindow(topWinConfig);

  topWin.on("closed", () => {
    try {
      console.log("toTopExe", toTopExe);
      toTopExe.kill();
    } catch (e) {}
    topWin = null;
    globalShortcut.unregister("Alt+F7");
  });

  if (app.isPackaged) {
    topWin.loadURL(
      "https://www.yunren.online/electron/" + packageJSON.version + "/"
    );
  } else {
    topWin.webContents.openDevTools();
    topWin.loadURL("http://localhost:9000/");
  }
  topWin.on("ready-to-show", () => {
    globalShortcut.register("Alt+F7", () => {
      const topPath = path.join(mainPath, "toTop.exe");
      toTopExe = exec(topPath, (err, stderr, stdout) => {
        console.log("err,stderr,stdout", err, stderr, stdout);
      });
    });
  });
}

ipcMain.on("closeTop", () => {
  try {
    topWin.destroy();
    topWin = null;
  } catch (e) {}
});

function createRecordWin() {}

module.exports = { onCreateTopWin };
