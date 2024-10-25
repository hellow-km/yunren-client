const fs = require("fs");
const path = require("path");
const jsObfuscator = require("javascript-obfuscator");
const { execSync } = require("child_process");

const excludes = ["node_modules", "jsMor", "images", "out", "public"];
//获取文件路径详情
function getFilepathIdentify(filepath) {
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

const workPath = path.join(__dirname, "../");
let num = 0;

let obJSON = {};

function start(p = workPath) {
  const dirs = fs.readdirSync(p);
  num += dirs.length;
  for (let i = 0; i < dirs.length; i++) {
    const file = dirs[i];
    if (excludes.includes(file)) {
      num--;
      continue;
    }
    const filePath = path.join(p, file);
    fs.readFile(filePath, (isDir, data) => {
      num--;
      if (isDir) {
        // start(p);
      } else {
        let idenfy = getFilepathIdentify(filePath);
        if (idenfy.extNoDot == "js") {
          morJS(filePath, idenfy.fileName, data.toString());
        }
      }
      if (num <= 0) {
        createJson();
      }
    });
  }
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

function createJson() {
  const obFilePath = path.join(__dirname, "obFile.json");
  fs.writeFileSync(obFilePath, JSON.stringify(obJSON));
}

function morJS(filePath, fileName, jsData) {
  const obOption = {
    compact: true,
    controlFlowFlattening: false,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: false,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: false,
    domainLock: [],
    domainLockRedirectUrl: "about:blank",
    forceTransformStrings: [],
    identifierNamesCache: null,
    identifierNamesGenerator: "hexadecimal",
    identifiersDictionary: [],
    identifiersPrefix: "",
    ignoreImports: false,
    inputFileName: "",
    log: false,
    numbersToExpressions: false,
    optionsPreset: "high-obfuscation",
    renameGlobals: false,
    renameProperties: false,
    renamePropertiesMode: "safe",
    reservedNames: [],
    reservedStrings: [],
    seed: 0,
    selfDefending: false,
    simplify: true,
    sourceMap: false,
    sourceMapBaseUrl: "",
    sourceMapFileName: "",
    sourceMapMode: "separate",
    sourceMapSourcesMode: "sources-content",
    splitStrings: false,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayCallsTransformThreshold: 0.5,
    stringArrayEncoding: [],
    stringArrayIndexesType: ["hexadecimal-number"],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 1,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 2,
    stringArrayWrappersType: "variable",
    stringArrayThreshold: 0.75,
    target: "browser",
    transformObjectKeys: false,
    unicodeEscapeSequence: false,
  };
  const restoreDir = path.join(__dirname, "resotre");
  createFolder(restoreDir);
  obJSON[filePath] = path.join(restoreDir, fileName);
  fs.copyFileSync(filePath, path.join(restoreDir, fileName));
  const obfuscationResult = jsObfuscator.obfuscate(jsData, obOption);
  const result = obfuscationResult.getObfuscatedCode();
  fs.writeFileSync(filePath, result);
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
