const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const child_process = require("child_process");
const path = require("path");
const Buffer = require("buffer");
const express = require("express");
const cors = require("cors");
const { getFilepathIdentify } = require("./utils");
// 检查是否运行在 asar 包中
const packageJSON = require("./package.json");

const isPackaged = () => {
  const execPath = process.execPath;
  return execPath.includes("yunren_tools.exe");
};

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const port = 15287;

app.listen(port, () => {});

const mainPath = isPackaged()
  ? path.join(__dirname, "../")
  : path.join(__dirname);

// 使用 contextBridge 安全地暴露 API 到渲染进程
contextBridge.exposeInMainWorld("api", {
  mainPath,
  fs,
  Buffer,
  path,
  port,
  require,
  isTop: true,
  version: packageJSON.version,
  child_process,
  getFilepathIdentify: (p) => {
    return getFilepathIdentify(p);
  },
  openPath: (p) => {
    shell.openPath(p);
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
  isPet: true,
  sendMessage: (channel, message) => {
    ipcRenderer.send(channel, message);
  },
  onReceiveMessage: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});
