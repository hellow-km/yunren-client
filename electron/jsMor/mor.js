const path = require("path");
const fs = require("fs");
const asarmor = require("asarmor");

async function start() {
  const asarPath = path.join(
    __dirname,
    "../out/win32/yunren_tools-win32-ia32/resources/app.asar"
  );
  const archive = await asarmor.open(asarPath);
  archive.patch(asarmor.createBloatPatch(50));
  const outputPath = await archive.write(asarPath);
}
// start();
