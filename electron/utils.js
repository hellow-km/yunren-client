const fs = require("fs");
const path = require("path");
const { exec, execSync, execFile } = require("child_process");
const { app } = require("electron");

//判断对象是否包含key
function ObjectKeysValid(obj, keys) {
  if (IsNullOrEmpty(obj)) {
    return false;
  }
  return !keys.some((key) => {
    return !Object.hasOwnProperty.call(obj, key);
  });
}

//判空
function IsNullOrEmpty(val) {
  return (
    typeof val === "undefined" ||
    val === "" ||
    val === null ||
    (typeof val === "object" &&
      (JSON.stringify(val) === "{}" || JSON.stringify(val) === "[]"))
  );
}

//时间转换文本
function formatMilliseconds(milliseconds) {
  // 将毫秒数转换为小时和分钟
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  // 构建格式化后的文本表示
  let result = "";
  if (hours > 0) {
    result += `${hours}小时`;
  }
  if (minutes > 0) {
    result += `${minutes}分钟`;
  }

  return result || "";
}

//获取文件路径详情
function getFilepathIdentify(filepath) {
  filepath = filepath.replaceAll("\\", "/");
  let lastIndex = filepath.lastIndexOf("/");
  let dir = filepath.substring(0, lastIndex);
  let fileName = filepath.substring(lastIndex + 1);
  let dotIndex = fileName.lastIndexOf(".");
  let ext = fileName.substring(dotIndex);
  let extNoDot = fileName.substring(dotIndex + 1);
  let fileNameNoExt = fileName.substring(0, dotIndex);
  return {
    dir,
    fileName,
    fileNameNoExt,
    ext,
    extNoDot,
  };
}

function existsFilePath(p) {
  if (fs.existsSync(p)) {
    const idf = getFilepathIdentify(p);
    return existsFilePath(
      path.join(idf.dir, idf.fileNameNoExt + "_" + idf.ext)
    );
  } else {
    return p;
  }
}

function getTempFolder() {
  const mainPath =
    __dirname.indexOf("resources") > -1
      ? path.join(__dirname, "../")
      : path.join(__dirname);
  const tempPath = path.join(mainPath, "temp");
  createFolder(tempPath);
  return tempPath;
}

function getTempName() {
  return (
    formatTime(new Date(), "yyyy-MM-dd_hhmmss") +
    Math.random().toString().slice(-6)
  );
}

function newTempFileName() {
  return joinDir(__dirname, "../temp", getTempName());
}

function formatTime(date, fmt = "yyyy-MM-dd hh:mm:ss") {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
}

//创建深层目录
function createFolder(paths) {
  let pathArr = paths.replaceAll("\\", "/").split("/");
  let currentPath = "";
  for (let i = 0; i < pathArr.length; i++) {
    currentPath += pathArr[i] + "/"; // Add separator here
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
  }
}

function joinDir(...arg) {
  return path.join(...arg);
}

function execDeleteSync(dir) {
  try {
    // 删除文件夹的命令（Windows系统）
    const windowsCmd = `rmdir /s /q "${dir}"`;

    // 执行命令
    execSync(windowsCmd);
    return null;
  } catch (e) {
    console.log("deleteE", e);
    return e;
  }
}

const tempPath = joinDir(__dirname, "../temp");

function httpRequest(type, host, path, data = "") {
  return new Promise((resolve, reject) => {
    const http = require("http");

    const options = {
      hostname: host,
      port: 80,
      path: path,
      method: type,
    };
    console.log(options);
    let result = "",
      err = null;
    const req = http.request(options, (res) => {
      res.on("data", (data) => {
        result += data.toString();
      });
      res.on("close", () => {
        console.log("result", result);
        resolve({ err, result });
      });
    });

    req.on("error", (error) => {
      err = error;
      resolve({ err, result });
    });

    req.write(typeof data == "string" ? data : JSON.stringify(data));
    req.end();
  });
}

function httpsRequest(type, host, path, data = "") {
  return new Promise((resolve, reject) => {
    const https = require("https");
    const options = {
      hostname: host,
      port: 443,
      path: path,
      method: type,
    };
    console.log(options);
    let result = "",
      err = null;
    const req = https.request(options, (res) => {
      res.on("data", (data) => {
        result += data.toString();
      });
      res.on("close", () => {
        console.log("result", result);
        resolve({ err, result });
      });
    });

    req.on("error", (error) => {
      err = error;
      resolve({ err, result });
    });
    req.write(typeof data == "string" ? data : JSON.stringify(data));
    req.end();
  });
}

function formatFileSize(size) {
  const sizeLabels = ["B", "KB", "MB", "GB", "TB"];

  let labelIndex = 0;
  while (size >= 1024 && labelIndex < sizeLabels.length - 1) {
    size /= 1024;
    labelIndex++;
  }

  let formattedSize = size.toFixed(2); // 保留两位小数
  while (
    (formattedSize && formattedSize[formattedSize.length - 1] == "0") ||
    formattedSize[formattedSize.length - 1] == "."
  ) {
    formattedSize = formattedSize.slice(0, formattedSize.length - 1);
  }
  return `${formattedSize} ${sizeLabels[labelIndex]}`;
}

function writeLog(data) {
  try {
    const logsPathDir = joinDir(__dirname, "./logs");
    const logsPath = joinDir(logsPathDir, "sqlLog.txt");
    createFolder(logsPathDir);
    if (fs.existsSync(logsPath)) {
      fs.appendFileSync(logsPath, data);
    } else {
      fs.writeFileSync(logsPath, data);
    }
  } catch (e) {}
}

const saveDownloadsPath = path.join(getTempFolder(), "saveDownloads");

module.exports = {
  ObjectKeysValid,
  IsNullOrEmpty,
  formatMilliseconds,
  getFilepathIdentify,
  getTempName,
  formatTime,
  createFolder,
  joinDir,
  execDeleteSync,
  httpsRequest,
  formatFileSize,
  writeLog,
  httpRequest,
  getTempFolder,
  existsFilePath,
  saveDownloadsPath,
};
