import htmlXml from "src/assets/images/tools/htmlXml.png";
import CSSCompress from "src/assets/images/tools/CSSCompress.png";
import JSSecret from "src/assets/images/tools/JSSecret.png";
import JSCompress from "src/assets/images/tools/JSCompress.png";
import JSONCompress from "src/assets/images/tools/JSON.png";
import imgCompress from "src/assets/images/tools/img-compress.png";
import imgConvert from "src/assets/images/tools/img-convert.png";
import imgIP from "src/assets/images/tools/ip.png";
import imgInfo from "src/assets/images/tools/imgInfo.png";
import officePreview from "src/assets/images/tools/officePreview.png";
import XLS from "src/assets/images/tools/XLS.png";
import imageMerge from "src/assets/images/tools/imageMerge.png";
import textImage from "src/assets/images/tools/text-icon.png";
import SpriteMake from "src/assets/images/tools/SpriteMake.png";
import SpriteSplit from "src/assets/images/tools/SpriteSplit.png";
import qrRegion from "src/assets/images/tools/qrRegion.png";
import qrCreate from "src/assets/images/tools/qrcode.png";

const loadLocalImg = window.api.loadLocalImg;

export const localImages = {
  minSize: loadLocalImg("minSize.png"),
  Maximize: loadLocalImg("Maximize.png"),
  Maximize_1: loadLocalImg("Maximize-1.png"),
  close: loadLocalImg("close.png"),
  menuIcon: loadLocalImg("Category.png"),
  renou: loadLocalImg("renou.png"),
  gougou: loadLocalImg("gougou.png"),
  action: loadLocalImg("action.png"),
  tip: loadLocalImg("tip.png"),
};

export const toolsImg = {
  htmlXml,
  CSSCompress,
  JSSecret,
  JSCompress,
  JSONCompress,
  imgCompress,
  imgConvert,
  imgIP,
  imgInfo,
  officePreview,
  XLS,
  imageMerge,
  textImage,
  SpriteMake,
  SpriteSplit,
  qrRegion,
  qrCreate,
  articles: loadLocalImg("articles.png"),
  pet: loadLocalImg("pet.png"),
  toTop: loadLocalImg("toTop.png"),
  packageDownload: loadLocalImg("packageDownload.png"),
  torrentDownload: loadLocalImg("torrentDownload.png"),
  videoToGif: loadLocalImg("videoToGif.png"),
  recordVideo: loadLocalImg("recordVideo.png"),
};

export const recordBtn = {
  play: loadLocalImg("播放.png"),
  pause: loadLocalImg("暂停.png"),
  stop: loadLocalImg("停止.png"),
};
