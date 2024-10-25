import { passwordStrength } from "check-password-strength";
import { Notify } from "quasar";
import axios from "src/boot/axios";
import { useI18n } from "vue-i18n";
// const { t } = useI18n();

export function trans(...args) {
  // t(...args);
}
//判断对象是否包含key
export function ObjectKeysValid(obj, keys) {
  return !keys.some((key) => {
    return !Object.hasOwnProperty.call(obj, key);
  });
}

//判空
export function IsNullOrEmpty(val) {
  return (
    typeof val === "undefined" ||
    val === "" ||
    val === null ||
    (typeof val === "object" &&
      (JSON.stringify(val) === "{}" || JSON.stringify(val) === "[]"))
  );
}

export const pwdArrays = [
  { label: "很弱", index: 0, color: "#FF0080" },
  { label: "弱", index: 1, color: "#ee5722" },
  { label: "中", index: 2, color: "#ffc107" },
  { label: "强", index: 3, color: "#26A69A" },
];

//判断密码强度
export function validPasswordStrength(text) {
  return pwdArrays[passwordStrength(text).id];
}

export function openFileDialog(
  isMulti,
  maxSize = 3 * 1024 * 1024,
  accept = "image/*"
) {
  return new Promise((resolve) => {
    let globalInput = document.getElementById("f_input_global");
    if (globalInput) {
      document.body.removeChild(globalInput);
    }
    let f_input = document.createElement("input");
    f_input.type = "file";
    f_input.accept = accept;
    f_input.style.display = "none";
    if (isMulti) {
      f_input.multiple = true;
    }
    f_input.id = "f_input_global";
    document.body.appendChild(f_input);
    let resFiles = [];
    f_input.onchange = function (e) {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (file.size < maxSize) {
          resFiles.push(file);
        } else {
          notify(`${file.name}${$t("overSize")}`, "warning");
        }
      }
      resolve(resFiles);
    };
    f_input.click();
  });
}

export function formatFileSize(size) {
  const sizeLabels = ["B", "KB", "MB", "GB", "TB"];

  let labelIndex = 0;
  while (size >= 1024 && labelIndex < sizeLabels.length - 1) {
    size /= 1024;
    labelIndex++;
  }

  let formattedSize = size.toFixed(2); // 保留两位小数
  while (
    (formattedSize &&
      formattedSize.indexOf(".") > -1 &&
      formattedSize[formattedSize.length - 1] == "0") ||
    formattedSize[formattedSize.length - 1] == "."
  ) {
    formattedSize = formattedSize.slice(0, formattedSize.length - 1);
  }
  return `${formattedSize} ${sizeLabels[labelIndex]}`;
}

export function pointNumZeroClear(str) {
  let formattedSize = str.toFixed(2); // 保留两位小数
  while (
    (formattedSize && formattedSize[formattedSize.length - 1] == "0") ||
    formattedSize[formattedSize.length - 1] == "."
  ) {
    formattedSize = formattedSize.slice(0, formattedSize.length - 1);
  }
  return formattedSize;
}

// 进度先快后慢增长函数
export function slowFastProgress(cb, current = 0, max = 100) {
  let interval = 50; // 初始间隔时间
  const rate = 0.1; // 控制速度的指数率

  let timer = setInterval(() => {
    // 当到达最大值时清除定时器
    if (current >= max) {
      cb && cb(max);
      clearInterval(timer);
      return;
    }
    const progress = current / max;
    const growth = Math.pow(progress, rate);
    const result = growth * max;
    current++;
    cb && cb(result);
  }, interval);
  return timer;
}

export function notify(message, type = "positive", position = "top") {
  Notify.create({
    message,
    type,
    position,
  });
}

export let defaultPageWidth = window.innerWidth - 30;

window.addEventListener("resize", () => {
  defaultPageWidth = window.innerWidth - 30;
});

export const isLessWidth = () => {
  return window.innerWidth < defaultPageWidth;
};

export function formatTime(date, fmt = "yyyy-MM-dd hh:mm:ss") {
  let d = null;
  if (!date) {
    d = new Date();
  } else if (typeof date === "string") {
    d = new Date(date.split(".")[0]);
  } else {
    d = date;
  }
  var o = {
    "M+": d.getMonth() + 1, //月份
    "d+": d.getDate(), //日
    "h+": d.getHours(), //小时
    "m+": d.getMinutes(), //分
    "s+": d.getSeconds(), //秒
    "q+": Math.floor((d.getMonth() + 3) / 3), //季度
    S: d.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (d.getFullYear() + "").substr(4 - RegExp.$1.length)
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

export function getTempName() {
  return (
    formatTime("", "yyyy-MM-dd hhmmss") + Math.random().toString().slice(-6)
  );
}

export function getNewID() {
  return formatTime("", "yyyyMMddhhmmss") + Math.random().toString().slice(-6);
}

export function proxyToObj(proxyData) {
  let obj = {};
  for (const key in proxyData) {
    if (Object.hasOwnProperty.call(proxyData, key)) {
      obj[key] = proxyData[key];
    }
  }
  return obj;
}

export function imgUrlTobase64(url) {
  return new Promise((resolve, reject) => {
    try {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");

      var img = new Image();
      img.crossOrigin = true;
      img.src = url;
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        resolve({
          err: null,
          result: canvas.toDataURL("image/png"),
          w: img.width,
          h: img.height,
        });
      };
      img.onerror = function (err) {
        resolve({ err, result: "" });
      };
    } catch (e) {
      resolve({ err: e, result: "" });
    }
  });
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    try {
      var reader = new FileReader();
      reader.onload = function (e) {
        var base64String = e.target.result; // 获取Base64编码字符串
        resolve({ err: null, result: base64String });
      };
      reader.readAsDataURL(file);
    } catch (e) {
      resolve({ err: e, result: "" });
    }
  });
}

export function getImageWidth(url, cb) {
  const image = new Image();
  image.crossOrigin = true;
  image.src = url;
  image.onload = function () {
    cb && cb(image.width, image.height);
  };
}

export function getTextWH(
  text,
  fontSize = "14px",
  maxWidth = 150,
  fontColor = "#000000",
  backgroundColor = "#ffffff"
) {
  const div = document.createElement("div");
  div.innerText = text;
  Object.assign(div.style, {
    maxWidth: maxWidth + "px",
    position: "fixed",
    left: -maxWidth - 50 + "px",
    top: "0",
    fontSize: fontSize,
    wordBreak: "break-all",
    fontFamily: "Arial",
    color: fontColor,
    backgroundColor: backgroundColor,
  });
  document.body.appendChild(div);

  let whEl = {
    w: div.offsetWidth,
    h: div.offsetHeight,
    el: div,
  };

  return whEl;
}

//下载图片
export function downloadFile(name, url, mine) {
  // 创建 XMLHttpRequest 对象
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob"; // 设置响应类型为 Blob

  // 请求成功时处理 Blob 数据
  xhr.onload = function () {
    if (xhr.status === 200) {
      // 创建 Blob 对象
      var blob = new Blob([xhr.response], { type: mine });

      // 创建 Blob URL
      var blobUrl = window.URL.createObjectURL(blob);

      // 创建一个 <a> 标签
      var link = document.createElement("a");
      link.href = blobUrl;
      link.download = name; // 设置下载文件名

      // 触发下载
      link.click();

      // 释放 Blob URL 对象
      window.URL.revokeObjectURL(blobUrl);
    }
  };

  // 发送请求
  xhr.send();
}

export function downloadImage(name, url) {
  downloadFile(name, url, "image/jpeg");
}

export function downloadZip(name, url) {
  downloadFile(name, url, "application/zip");
}

export function percent(n1, n2) {
  return (((n2 - n1) / n2).toFixed(2) * 100).toFixed(0);
}

export function saveBase64Image(base64) {
  // 创建一个 Blob 对象
  var byteCharacters = atob(base64.split(",")[1]);
  var byteNumbers = new Array(byteCharacters.length);
  for (var i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  var byteArray = new Uint8Array(byteNumbers);
  var blob = new Blob([byteArray], { type: "image/png" });

  // 创建一个隐藏的 <a> 元素
  var link = document.createElement("a");
  var url = URL.createObjectURL(blob);
  link.href = url;
  link.download = "image.png"; // 设置下载文件名
  document.body.appendChild(link); // 将链接添加到页面
  link.click(); // 触发下载
  document.body.removeChild(link); // 下载完成后移除链接
  URL.revokeObjectURL(url); // 释放 URL 对象
}

//获取文件路径详情
export function getFilepathIdentify(filepath) {
  filepath = filepath.replaceAll("\\", "/");
  let lastIndex = filepath.lastIndexOf("/");
  let dir = filepath.substring(0, lastIndex);
  let fileName = filepath.substring(lastIndex);
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

export function isNewDay(date1, date2) {
  return (
    date1.getFullYear() !== date2.getFullYear() ||
    date1.getMonth() !== date2.getMonth() ||
    date1.getDate() !== date2.getDate()
  );
}

//根据年月获取所有天
export function getDaysInMonth(year, month) {
  // 注意月份是从 0 开始的，所以需要将传入的月份减 1
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const daysInMonth = [];

  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    daysInMonth.push(new Date(date));
  }

  return daysInMonth;
}
