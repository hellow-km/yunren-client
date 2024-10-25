import { clickGames } from "src/http/games";

export function openWindowWithIframe(src, name, width = 1000, height = 800) {
  // 新窗口的大小和位置
  var left = (screen.width - width) / 2;
  var top = (screen.height - height) / 2;

  // 打开新窗口
  var newWindow = window.open(
    "about:blank", // URL设置为空字符串或者about:blank表示新窗口加载一个空白页面
    name,
    "width=" + width + ",height=" + height + ",left=" + left + ",top=" + top
  );
  newWindow.name = name;
  // 在新窗口中创建一个 iframe
  var iframe = document.createElement("iframe");
  iframe.src = src; // 在这里替换为你想要嵌入的网页地址
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.style.border = "none";
  // 将 iframe 添加到新窗口中
  newWindow.document.body.appendChild(iframe);
}

export function openGamesWindows(href, name) {
  clickGames({ name });
  openWindowWithIframe(href, name);
}
