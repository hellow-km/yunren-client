import { boot } from "quasar/wrappers";
import axios from "axios";
import { config } from "src/config";
import { notify } from "src/utils";
import { useHttpStore } from "src/stores/http";
import { useCommonStore } from "src/stores/common";
import CryptoJS from "crypto-js";
import md5 from "md5";
const httpStore = useHttpStore();
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
let keyN = md5("iamrubishit");

function decryptMessage(data) {
  const { iv, content } = data;
  const key = CryptoJS.enc.Hex.parse(keyN);
  const ivBase64 = CryptoJS.enc.Base64.parse(iv);
  const contentBase64 = CryptoJS.enc.Base64.parse(content);

  const decrypted = CryptoJS.AES.decrypt({ ciphertext: contentBase64 }, key, {
    iv: ivBase64,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return CryptoJS.enc.Utf8.stringify(decrypted);
}

const http2 = axios.create({
  // timeout: 1000 * 4,
  withCredentials: true,
});
const http = axios.create({
  // timeout: 1000 * 4,
  withCredentials: true,
  baseURL: config.serverUrl,
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = http;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

// 请求拦截器
const beforeRequest = (config) => {
  // httpStore.isRequested = true;
  // 设置 token
  const token = localStorage.getItem("token");
  token && (config.headers.Authorization = token);
  // NOTE  添加自定义头部
  // config.headers['my-header'] = 'jack'
  return config;
};

http.interceptors.request.use(beforeRequest);

// 响应拦截器
const responseSuccess = (response) => {
  // httpStore.isRequested = false;
  // eslint-disable-next-line yoda
  // 这里没有必要进行判断，axios 内部已经判断
  // const isOk = 200 <= response.status && response.status < 300
  let data = response.data;
  if (data.code !== 0) {
    if (data.code === 300) {
      notify("请登录后重试", "negative");
      useCommonStore().loginVisible = true;
    } else if (data.code === 400) {
      notify(data.errMsg || "登录过期，请重新登录", "negative");
      useCommonStore().loginVisible = true;
    } else {
      notify(data.errMsg || "出现错误", "negative");
    }
  }
  let newData = {};
  try {
    newData = JSON.parse(decryptMessage(data.data));
  } catch (e) {
    console.log("ee", e);
    newData = {};
  }
  data.data = newData;
  return Promise.resolve(data);
};

const responseFailed = (error) => {
  // httpStore.isRequested = false;
  const { response } = error;
  if (response) {
    // handleError(response)
    // cons error = new Error(response.data.msg)
    return Promise.reject();
  } else if (!window.navigator.onLine) {
    return Promise.reject(new Error("请检查网络连接"));
  }
  return Promise.reject(error);
};

http.interceptors.response.use(responseSuccess, responseFailed);

export { http, http2 };
