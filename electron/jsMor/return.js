const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function start() {
  const obFilePath = path.join(__dirname, "obFile.json");

  const data = fs.readFileSync(obFilePath).toString();
  let jsonData = JSON.parse(data);
  for (const oPath in jsonData) {
    if (Object.hasOwnProperty.call(jsonData, oPath)) {
      const nPath = jsonData[oPath];
      const d = fs.readFileSync(nPath);
      fs.writeFileSync(oPath, d);
    }
  }
  try {
    execDeleteSync(path.join(__dirname, "resotre"));
  } catch (e) {}
  try {
    fs.unlinkSync(obFilePath);
  } catch (e) {}
}

function execDeleteSync(dir) {
  try {
    // 删除文件夹的命令（Windows系统）
    const windowsCmd = `rmdir /s /q "${dir}"`;

    // 执行命令
    execSync(windowsCmd);
    return null;
  } catch (e) {
    return e;
  }
}
start();
