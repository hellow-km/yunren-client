const { contextBridge, ipcRenderer, shell } = require("electron");
const fs = require("fs");
const child_process = require("child_process");
const path = require("path");
const Buffer = require("buffer");
const {
  getFilepathIdentify,
  createFolder,
  getTempFolder,
  saveDownloadsPath,
} = require("./utils");

const { videoToGif } = require("./video");

// 检查是否运行在 asar 包中
const packageJSON = require("./package.json");

const isPackaged = () => {
  const execPath = process.execPath;
  return execPath.includes("yunren_tools.exe");
};

const mainPath = isPackaged()
  ? path.join(__dirname, "../")
  : path.join(__dirname);

// 使用 contextBridge 安全地暴露 API 到渲染进程
contextBridge.exposeInMainWorld("api", {
  mainPath,
  fs,
  Buffer,
  path,
  require,
  videoToGif,
  createFolder,
  getFilepathIdentify: (p) => {
    return getFilepathIdentify(p);
  },
  openInBrowser: (url) => {
    shell.openExternal(url);
  },
  version: packageJSON.version,
  child_process,
  openPath: (p) => {
    shell.openPath(p);
  },
  openDownloadPath: () => {
    const downloadFolder = path.join(getTempFolder(), "download");
    shell.openPath(downloadFolder);
  },
  openFolder: (p) => {
    shell.openExternal(p);
  },
  getDownloadsFile: () => {
    if (fs.existsSync(saveDownloadsPath)) {
      return fs.readFileSync(saveDownloadsPath).toString();
    } else {
      return null;
    }
  },
  readFileSync: (p) => {
    return fs.readFileSync(p).toString();
  },
  loadLocalImg: (imgPath) => {
    let igPath = path.join(mainPath, "images", imgPath);
    let idenfy = getFilepathIdentify(igPath);
    let imgData = fs.readFileSync(igPath);
    let mime = `data:image/${idenfy.extNoDot};base64,`;
    return mime + Buffer.Buffer.from(imgData).toString("base64");
  },
  sendMessage: (channel, message) => {
    ipcRenderer.send(channel, message);
  },
  onReceiveMessage: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});
