const child_process = require("child_process");
const path = require("path");
const obPath = path.join(__dirname, "./jsob.js");
const returnPath = path.join(__dirname, "./return.js");
const electronPath = path.join(__dirname, "../");
const morPath = path.join(__dirname, "./mor.js");
const morJS = `node ${obPath}`;

const rmOut = `rmdir /s /q ${path.join(__dirname, "../out")}`;

const packJS = `cd ${electronPath}&&npm run pack:win32`;

const asarmorJS = `node ${morPath}`;

const returnJS = `node ${returnPath}`;

const copyFile = `${path.join(__dirname, "../copy.bat")}`;

const pro = child_process.exec(
  `${morJS}&&${rmOut}&&${packJS}&&${copyFile}&&${asarmorJS}`
);

pro.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

pro.stderr.on("data", (data) => {
  // child_process.exec(returnJS);
  console.error(`stderr: ${data}`);
});

pro.on("close", (code) => {
  child_process.exec(returnJS);
});
