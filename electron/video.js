const path = require("path");
const { getFilepathIdentify, createFolder } = require("./utils");
let ffmpeg;

const isPackaged = () => {
  const execPath = process.execPath;
  return execPath.includes("yunren_tools.exe");
};

if (isPackaged()) {
  ffmpeg = require("../ffmpeg/index");
} else {
  ffmpeg = require("./ffmpeg/index");
}

const mainPath = isPackaged()
  ? path.join(__dirname, "../")
  : path.join(__dirname);

// 设置FFmpeg的路径
ffmpeg.setFfmpegPath(path.join(mainPath, "ffmpeg/ffmpeg.exe"));

function videoToGif(
  inputPath,
  outputPath,
  startTime,
  duration,
  gifWidth,
  callback
) {
  const identify = getFilepathIdentify(outputPath);
  createFolder(identify.dir);
  ffmpeg(inputPath)
    .setStartTime(startTime)
    .duration(duration)
    .outputOptions([
      "-vf",
      `fps=10,scale=${gifWidth}:-1:flags=lanczos`,
      "-f",
      "gif",
    ])
    .save(outputPath)
    .on("end", () => {
      console.log("Conversion finished.");
      callback(null);
    })
    .on("error", (err) => {
      console.error("Error:", err);
      callback(err);
    });
}

module.exports = {
  videoToGif,
};
