<template>
  <div class="home-page">
    <div class="home-tools-box">
      <div
        class="home-tools-item"
        v-for="item in menuList"
        :key="item.title"
        @click="toPath(item.path)"
      >
        <div
          class="tool-itembox"
          :data-top="item.top"
          :data-left="item.left"
        >
          <img
            class="anime-img"
            :src="item.imgSrc"
            alt=""
          >
          <div class="overlay-box">
            <div class="tool-item-overlay">
              <div class="item-overlay-box">
                <div class="item-overlay-title text-h5">{{$t(item.title)}}</div>
                <div class="item-overlay-desc">{{$t(item.desc)}}</div>
              </div>
            </div>

          </div>
          <div class="tool-item-overlay tool-item-overlay-right">{{$t(item.title)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import imgIP from "src/assets/images/tools/ip.png"
import miButton from "src/components/form/mi-button.vue"
import { useRoute, useRouter } from "vue-router";
import { getArticles } from "src/http/article";
import gamesJSON from "./gamesJSON"
import { defaultPageWidth, isNewDay, pointNumZeroClear } from "src/utils";
import { useUserStore } from "src/stores/user";
import { useCommonStore } from "src/stores/common";
import { getHotGames } from "src/http/games"
import { openGamesWindows } from "src/utils/games"
import { useQuasar } from "quasar";
import { toolsImg } from "src/utils/images"
import { baidiTuisong, getClientIP, getWeather } from "src/http/common";
import weather from "src/pages/components/weather.vue"
import { xlsText, xlsDesc, imageMerge } from "src/utils/string"
const { mainPath, fs, path, createFolder, getFilepathIdentify, readFileSync, openPath } = window.api

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const hotArticles = ref([])
const userStore = useUserStore()
const hotGames = ref([])
const common = useCommonStore()

const itemHeight = ref(300)

defineOptions({
  name: 'IndexPage'
});

const menuList = ref([
  {
    title: "translations.SpriteMake",
    path: "/SpriteMake",
    imgSrc: toolsImg.SpriteMake,
    desc: "translations.SpriteMakeDesc"
  },
  {
    title: "imageMerge",
    path: "/imageMerge",
    desc: "translations.uploadMaterialDesc",
    imgSrc: toolsImg.imageMerge
  },
  {
    imgSrc: toolsImg.XLS,
    title: "xlsText",
    desc: "xlsDesc",
    path: "/xlsEdit"
  },
  {
    title: 'recordVideo',
    path: "/recordVideo",
    imgSrc: toolsImg.recordVideo,
    desc: "recordVideoDesc"
  },
  {
    title: 'toTopTool',
    path: "/toTopTool",
    imgSrc: toolsImg.toTop,
    desc: "toTopToolDesc"
  },
  {
    imgSrc: toolsImg.imgCompress,
    title: "translations.imageCompressTitle",
    desc: "translations.imageCompressDesc",
    path: "/imgCompress"
  },
  {
    imgSrc: toolsImg.imgConvert,
    title: "translations.imageConvertTitle",
    desc: "translations.imageConvertDesc",
    path: "/imgConverter"
  },
  {
    title: "translations.videoToGif",
    path: "/videoToGif",
    imgSrc: toolsImg.videoToGif,
    desc: "translations.videoToGif",
  },
  {
    title: "translations.textToImage",
    path: "/textToImage",
    imgSrc: toolsImg.textImage,
    desc: "translations.textToImage",
  },
  {
    title: 'packageDownload',
    path: "/packageDownload",
    imgSrc: toolsImg.packageDownload,
    desc: "packageDownloadDesc"
  },
  {
    imgSrc: toolsImg.articles,
    title: "articles",
    desc: "articles",
    path: "/articles"
  },
  {
    imgSrc: toolsImg.imgIP,
    title: "translations.ipQueryTitle",
    desc: "translations.ipQueryDesc",
    path: "/IPSelect"
  },
  {
    title: "translations.qrRegion",
    path: "/qrRegion",
    imgSrc: toolsImg.qrRegion,
    desc: "translations.qrRegionDesc",
  },
  {
    title: "translations.qrCreate",
    path: "/qrCreate",
    imgSrc: toolsImg.qrCreate,
    desc: "translations.qrCreateDesc",
  },
  {
    imgSrc: toolsImg.JSCompress,
    title: "translations.jsCompressTitle",
    desc: "translations.jsCompressDesc",
    path: "/jsCompress"
  },
  {
    imgSrc: toolsImg.CSSCompress,
    title: "translations.cssCompressTitle",
    desc: "translations.cssCompressDesc",
    path: "/cssCompress"
  },
  {
    imgSrc: toolsImg.JSCompress,
    title: "translations.jsonCompressTitle",
    desc: "translations.jsonCompressDesc",
    path: "/jsonCompress"
  },
  {
    imgSrc: toolsImg.JSSecret,
    title: "translations.jsEncryptTitle",
    desc: "translations.jsEncryptDesc",
    path: "/jsObfuscator"
  },
  {
    imgSrc: toolsImg.htmlXml,
    title: "translations.htmlToXMLTitle",
    desc: "translations.htmlToXMLDesc",
    path: "/htmlToXML"
  },
  {
    imgSrc: toolsImg.imgInfo,
    title: "translations.pictureInfoTitle",
    desc: "translations.pictureInfoDesc",
    path: "/pictureInfo"
  },

])

const toPath = (path) => {
  if (path == "/toTopTool") {
    window.api.sendMessage("openTop")
    gtag("event", "click", {
      event_category: path,
      event_label: "首页",
      value: 1,
    });
    return
  }
  router.push(path)

  gtag("event", "click", {
    event_category: path,
    event_label: "首页",
    value: 1,
  });
}
const formatModelData = (filePath, isUsed = false, type = "1") => {
  const idenfy = getFilepathIdentify(filePath);

  return {
    isUsed: isUsed,
    path: "http://localhost:15287/" + filePath,
    name: idenfy.fileNameNoExt,
    backImage: "",
    localPath: path.join(mainPath, "public", filePath)
  }
}
onMounted(async () => {
  const modelListFile = path.join(mainPath, "model")
  const actionsListFile = path.join(mainPath, "actions")
  const defaultModelData = [formatModelData("models/蓬莱人形/上海人形_ver1.00.pmx", true, "1")]

  const defaultActionsData = fs.readdirSync(path.join(mainPath, "public/motions")).filter(item => {
    const idenfy = getFilepathIdentify(item)
    return idenfy.extNoDot.toLocaleLowerCase() == "vmd"
  }).map((item, index) => formatModelData("motions/" + item, index < 5, "2"))

  if (!fs.existsSync(modelListFile)) {
    fs.writeFileSync(modelListFile, JSON.stringify(defaultModelData))
  }
  if (!fs.existsSync(actionsListFile)) {
    fs.writeFileSync(actionsListFile, JSON.stringify(defaultActionsData))
  }
})
</script>

<style lang="scss" scoped>
.home-page {
  display: flex;
  justify-content: center;
  .home-tools-box {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 5%;
    .home-tools-item {
      position: relative;
      width: 18%;
      margin-left: 5%;
      margin-top: 5%;
      height: 150px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      overflow: hidden;
      border: 1px solid #eee;
      box-sizing: border-box;
      border-radius: 6px;
      align-items: center;

      .tool-itembox {
        height: 100%;
        width: 100%;
        padding: 8px;
        padding-top: 16px;
        img {
          height: calc(100% - 40px);
        }
        text-align: center;
        cursor: pointer;
        overflow: hidden;
        .overlay-box {
          display: flex;
        }
        &:hover {
          .tool-item-overlay {
            transform: translateX(0);
          }
          .tool-item-overlay-right {
            left: 100%;
          }
          .item-overlay-desc {
            white-space: normal;
          }
        }
        .tool-item-overlay {
          transition: all 0.5s;
          position: absolute;
          top: 0;
          right: 0;
          transform: translateX(-100%);
          left: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.1);
          overflow: hidden;
          white-space: nowrap;
          .item-overlay-box {
            position: absolute;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.5);
            color: #fff;
            left: 0;
            right: 0;
            bottom: 0;
            .item-overlay-desc {
              white-space: normal;
              padding: 0 10px;
              font-size: 12px;
              margin-top: 8px;
            }
            .item-overlay-title {
              width: 100%;
              font-size: 20px;
            }
          }
        }
        .tool-item-overlay-right {
          transform: translateX(0);
          background-color: transparent;
          font-size: 16px;
          top: unset;
          line-height: 30px;
          bottom: 0;
          right: 0;
          color: #fff;
          height: 30px;
          background-color: rgba(0, 0, 0, 0.3);
        }
      }
    }
  }
}
</style>
