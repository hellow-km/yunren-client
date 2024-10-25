const { ipcMain } = require("electron");
const fs = require("fs");
const {
  getFilepathIdentify,
  getTempFolder,
  existsFilePath,
  createFolder,
  formatFileSize,
  execDeleteSync,
} = require("./utils");
const path = require("path");
const { proxyData } = require("./Proxy");
const https = require("https");
const http = require("http");
const downloadMap = new Map();
const isPackage = __dirname.indexOf("resources") > -1;
let WebTorrent;
if (isPackage) {
  WebTorrent = require("../webtorrent_commonjs/dist2/webtorrent");
} else {
  WebTorrent = require("./webtorrent_commonjs/dist2/webtorrent");
}

let client;

// 动态导入 WebTorrent 模块
async function loadWebTorrent() {
  const webC = await WebTorrent;
  client = new webC.default();
}

// 加载 WebTorrent 模块
loadWebTorrent();

const replyFields = [
  "id",
  "url",
  "progress",
  "state",
  "message",
  "speed",
  "filePath",
  "isDelete",
  "downloadedBytes",
  "totalBytes",
  "isTorrent",
];

function sendReply(row, e) {
  let o = {};
  for (const key in row) {
    if (Object.hasOwnProperty.call(row, key)) {
      if (replyFields.includes(key)) {
        o[key] = row[key];
      }
    }
  }
  e.reply("updateDownloadRow", o);
}

function getTorrentFileName(url_tor) {
  let arr = url_tor.split("&");
  let obj = { fileName: "" };
  arr.forEach((item) => {
    let a = item.split("=");
    if (a[0] == "dn") {
      obj.fileName = a[1];
    }
  });
  return obj;
}

function startDownload(row, e) {
  const downloadFolder = path.join(getTempFolder(), "download");
  createFolder(downloadFolder);
  let mapObj = {};
  if (!downloadMap.get(row.id)) {
    let fileIdenfy, filePath;
    if (row.isTorrent) {
      fileIdenfy = getTorrentFileName(row.url);
      filePath = fileIdenfy.fileName;
    } else {
      fileIdenfy = getFilepathIdentify(row.url);
      filePath = existsFilePath(
        path.join(downloadFolder, fileIdenfy.fileName.split("?")[0])
      );
    }
    mapObj = {
      ...row,
      downloadStream: null,
      writeStream: null,
      downloadUrl: row.url,
      filePath,
      downloadedBytes: 0,
      totalBytes: 0,
    };

    downloadMap.set(row.id, mapObj);
  } else {
    mapObj = downloadMap.get(row.id);
  }
  let obj = proxyData(
    {
      ...mapObj,
    },
    (obj, property, value) => {
      obj[property] = value;
      downloadMap.set(obj.id, obj);
    },
    (obj, property) => {
      let d = downloadMap.get(obj.id);
      return d[property];
    }
  );

  if (obj.isTorrent) {
    torrentDownload(obj, e);
  } else {
    httpDownload(obj, e);
  }
}

//torrent下载
function torrentDownload(obj, e) {
  function end(isErr, message) {
    if (isErr) {
      Object.assign(obj, {
        state: "4",
        message,
      });
    } else {
      obj.state = "3";
    }
    obj.speed = "";
    obj.timer && clearInterval(obj.timer);
    obj.torrent.destroy({}, () => {
      sendReply(obj, e);
    });
  }

  const downloadFolder = path.join(getTempFolder(), "download", obj.filePath);
  createFolder(downloadFolder);
  if (!obj.torrent) {
    const torrent = client.add(obj.url, { path: downloadFolder });
    obj.torrent = torrent;
  } else {
    obj.torrent.resume();
  }
  obj.state = "2";
  let prevBytes = 0;
  let speed = 500;
  obj.speedArr = [];
  obj.timer && clearInterval(obj.timer);
  obj.timer = setInterval(() => {
    let newSize = obj.downloadedBytes - prevBytes;
    obj.speedArr.push(newSize);
    if (obj.speedArr.length >= 1000 / speed) {
      let nS = obj.speedArr.reduce((prev, cur) => {
        return prev + cur;
      }, 0);
      if (nS === 0) {
        obj.speed = "0B/s";
      } else {
        obj.speed = formatFileSize(nS) + "/s";
      }
      obj.speedArr.pop();
    }
    prevBytes = obj.downloadedBytes;
    sendReply(obj, e);
  }, speed);

  obj.torrent.on("download", () => {
    obj.downloadedBytes = obj.torrent.downloaded;
    let progress = (obj.downloadedBytes / obj.totalBytes).toFixed(2);
    obj.progress = isNaN(progress) ? 0 : progress;
  });

  obj.torrent.on("ready", () => {
    obj.totalBytes = obj.torrent.length;
  });

  obj.torrent.on("done", () => {
    let newSize = obj.downloadedBytes - prevBytes;
    obj.speed = formatFileSize(newSize) + "/s";
    obj.progress = 1;
    end();
  });
  obj.torrent.on("error", (err) => {
    end(true, err.message);
  });
}

//http下载
function httpDownload(obj, e) {
  let httpModule = http;
  if (obj.url.slice(0, 5) == "https") {
    httpModule = https;
  }

  const options = {
    headers: {
      Range: `bytes=${obj.downloadedBytes}-`,
    },
  };
  function end(isErr, message) {
    if (isErr) {
      Object.assign(obj, {
        state: "4",
        message,
      });
    } else {
      obj.state = "3";
    }
    obj.speed = "";
    obj.timer && clearInterval(obj.timer);
    sendReply(obj, e);
  }
  try {
    new URL(obj.url);
    const req = httpModule.get(obj.url, options, (response) => {
      try {
        if (response.statusCode === 206 || response.statusCode === 200) {
          obj.state = "2";
          if (!obj.totalBytes) {
            const totalBytes =
              obj.downloadedBytes +
              parseInt(response.headers["content-length"], 10);
            obj.totalBytes = totalBytes;
          }
          let prevBytes = 0;
          obj.writeStream = fs.createWriteStream(obj.filePath, {
            flags: obj.downloadedBytes ? "a" : "w",
          });
          let speed = 500;
          obj.speedArr = [];
          obj.timer && clearInterval(obj.timer);
          obj.timer = setInterval(() => {
            let newSize = obj.downloadedBytes - prevBytes;
            obj.speedArr.push(newSize);
            if (obj.speedArr.length >= 1000 / speed) {
              let nS = obj.speedArr.reduce((prev, cur) => {
                return prev + cur;
              }, 0);
              if (nS === 0) {
                obj.speed = "0B/s";
              } else {
                obj.speed = formatFileSize(nS) + "/s";
              }
              obj.speedArr.pop();
            }
            prevBytes = obj.downloadedBytes;
            sendReply(obj, e);
          }, speed);

          response.on("data", (chunk) => {
            obj.downloadedBytes += chunk.length;
            let progress = (obj.downloadedBytes / obj.totalBytes).toFixed(2);
            obj.writeStream.write(chunk);
            obj.progress = progress;
          });

          response.on("end", () => {
            let newSize = obj.downloadedBytes - prevBytes;
            obj.speed = formatFileSize(newSize) + "/s";
            obj.progress = 1;
            obj.writeStream.end();
            if (obj.downloadedBytes === obj.totalBytes) {
              console.log("Download completed.");
            }
            end();
          });

          response.on("error", (err) => {
            if (err.message != "aborted") {
              end(true, err.message);
            }
          });
        } else {
          console.error(`Error: ${response.statusCode}`);
        }
        obj.writeStream.on("error", (err) => {
          end(true, err.message);
        });
      } catch (e) {
        end(true, e.message);
      }
    });
    obj.req = req;
    req.on("error", (err) => {
      console.log("err.message", err.message);
      end(true, err.message);
    });
  } catch (err) {
    end(true, err.message);
  }
}

function pauseDownload(row, e) {
  let obj = downloadMap.get(row.id);
  if (!obj) {
    row.message = "出错了";
    sendReply(row, e);
    return;
  }
  try {
    if (row.isTorrent) {
      obj.timer && clearInterval(obj.timer);
      obj.state = "6";
      obj.torrent.pause();
    } else {
      obj.timer && clearInterval(obj.timer);
      obj.req.abort();
      obj.state = "6";
    }
    sendReply(obj, e);
  } catch (err) {
    obj.message = err.message;
    sendReply(obj, e);
  }
}

function resumeDownload(row, e) {
  startDownload(row, e);
}

function cancelDownload(row, e) {
  let obj = downloadMap.get(row.id);
  if (obj) {
    try {
      if (row.isTorrent) {
        obj.timer && clearInterval(obj.timer);
        obj.torrent.destroy({ destroyStore: true }, () => {
          downloadMap.delete(row.id);
        });
      } else {
        obj.timer && clearInterval(obj.timer);
        obj.req.abort();
        obj.writeStream.end();
        fs.unlinkSync(obj.filePath);
        downloadMap.delete(row.id);
      }
      obj.progress = 0;
      obj.state = "1";
      obj.speed = "";
      sendReply(obj, e);
    } catch (err) {
      obj.progress = 0;
      obj.state = "1";
      obj.speed = "";
      sendReply(obj, e);
    }
  } else {
    obj = row;
    obj.progress = 0;
    obj.state = "1";
    obj.speed = "";
    sendReply(obj, e);
  }
}

function deleteDownload(row, e) {
  let obj = downloadMap.get(row.id);
  if (obj) {
    try {
      row.isDelete = true;
      sendReply(row, e);
      downloadMap.delete(row.id);
      if (row.isDeleteFile) {
        if (obj.isTorrent) {
          const downloadFolder = path.join(
            getTempFolder(),
            "download",
            obj.filePath
          );
          execDeleteSync(downloadFolder);
        } else {
          fs.unlinkSync(obj.filePath);
        }
      }
    } catch (err) {
      console.log("Err", err);
    }
  } else {
    row.isDelete = true;
    sendReply(row, e);
  }
}

module.exports = {
  startDownload,
  pauseDownload,
  resumeDownload,
  cancelDownload,
  deleteDownload,
};
