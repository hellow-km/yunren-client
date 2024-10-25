const path = require("path");
const fs = require("fs");

const jsobfuscator = require("javascript-obfuscator");

const excludeFiles = [
  "jsObfuscator",
  "xlsEdit",
  "i18n",
  "minify",
  "MainLayout",
];

const buildJsPath = path.join(__dirname, "../dist/spa/assets");
const dirPath = fs.readdirSync(buildJsPath);

dirPath.forEach((fileName) => {
  let ident = getFilepathIdentify(fileName);
  if (ident.extNoDot.toLocaleLowerCase() == "js") {
    if (
      !excludeFiles.some((item) => {
        return fileName.split(".")[0] == item;
      })
    ) {
      let p = path.join(buildJsPath, fileName);
      if (fs.statSync(p).size < 100 * 1024) {
        console.log(fs.statSync(p).size);
        obJs(p);
      }
    }
  }
});

function obJs(jsPath) {
  try {
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
      optionsPreset: "medium-obfuscation",
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
    let data = fs.readFileSync(jsPath);
    const obfuscationResult = jsobfuscator.obfuscate(data.toString(), obOption);
    fs.writeFileSync(jsPath, obfuscationResult.getObfuscatedCode());
    console.log(`wirte ok ${jsPath}`);
  } catch (e) {
    console.log(`wirte error ${jsPath}`, e);
  }
}

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
