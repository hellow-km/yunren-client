<template>
  <div class="merge-page">
    <div class="options">
      <div class="options-row">
        <span>{{ $t('backgroundColor') }}</span>
        <colorPicker v-model="designOption.backgroundColor">
        </colorPicker>
        <miCheckbox
          v-model="designOption.isTransparent"
          :label="$t('transparentBackground')"
        ></miCheckbox>
      </div>
      <div class="options-row">
        <span>{{ $t('addText') }}</span>
        <miInput
          v-model="addUseText"
          class="options-back-ipt"
        ></miInput>
        <span>
          <miButton
            :label="$t('fontSetting')"
            color="white"
            text-color="black"
          ></miButton>
          <q-menu touch-position>
            <div style="padding:30px">
              <span>{{ $t('maxWidth') }}</span>
              <mi-input v-model="fontSetting.maxWidth"></mi-input>
              <span>{{ $t('fontSize') }}<span>{{fontSetting.fontSize}}px</span></span>
              <q-slider
                v-model="fontSetting.fontSize"
                :min="12"
                :max="30"
              />
              <span>{{ $t('fontColor') }}</span>
              <colorPicker v-model="fontSetting.color">
              </colorPicker>
              <span>{{ $t('fontBgColor') }}</span>
              <colorPicker v-model="fontSetting.backgroundColor">
              </colorPicker>
              <miCheckbox
                v-model="fontSetting.isTransparent"
                :label="$t('transparentBackground')"
              ></miCheckbox>
            </div>
          </q-menu>
        </span>
        <span>
          <miButton
            style="margin-left:15px"
            @click="onAddText"
            :label="$t('add')"
            :loading="addLoading"
          ></miButton>
        </span>
      </div>
      <div class="options-row">
        <span>
          <miButton
            :label="$t('canvasSizeSetting')"
            color="white"
            text-color="black"
          ></miButton>
          <q-menu touch-position>
            <div style="padding:30px">
              <span>{{ $t('sizeSetting') }}</span>
              <div class="row items-center">
                <mi-input
                  type="number"
                  @blur="onChangePaperSet"
                  v-model="paperSetting.width"
                  style="width:100px;text-align:center"
                ></mi-input>
                <span>x</span>
                <mi-input
                  @blur="onChangePaperSet"
                  type="number"
                  style="width:100px;text-align:center"
                  v-model="paperSetting.height"
                ></mi-input>
              </div>
            </div>
          </q-menu>
        </span>
      </div>
      <div>
        <miButton
          :label="$t('saveImage')"
          @click="saveImage"
        ></miButton>
      </div>
    </div>
    <div class="page-pannel">
      <div class="merge-left-imgCollect">
        <div class="text-h6">{{ $t('materialLibrary') }}</div>
        <div
          class="img-item upload-btn"
          @click="uploadImg"
        >
          <q-tooltip>
            {{ $t('uploadTransparentBg') }}
          </q-tooltip>
          <img
            class="img"
            width="30"
            src="../../assets/images/common/add.png"
            alt=""
          >
        </div>
        <div class="iamge-list">
          <div
            class="img-item"
            @click="collectionSelect(item)"
            v-for="(item,index) in imageCollection"
            :key="item"
          >
            <img
              class="img"
              :src="item.url"
              alt=""
            >
            <q-tooltip>
              {{item.title}}
            </q-tooltip>
            <span
              v-if="index>0"
              class="close-btn"
              @click.stop="deleteCollection(index)"
            >
              <img
                width="20"
                height="20"
                src="../../assets/images/common/close.svg"
                alt=""
              ></span>
          </div>
        </div>
      </div>
      <div
        :style="{
          backgroundColor:designOption.isTransparent?'transparent':designOption.backgroundColor
        }"
        class="img-merge-pannel"
        :ref="(el) => setRefMap(el, {id:'mergePanel'})"
      >
        <div
          class="save-box"
          :style="{
            width:paperSetting.showWidth+'px',
            height:paperSetting.showHeight+'px'
          }"
        ></div>
        <VueDraggableResizable
          v-for="(item,index) in pannelElList"
          :key="item.id"
          parent
          :w="item.w"
          :h="item.h"
          :x="item.x"
          :y="item.y"
          :style="{
            zIndex:item.zIndex||'auto'
          }"
          :onResize="(...arg)=>onResizeCallback(item,...arg)"
          :onDrag="(...arg)=>onDragCallback(item,...arg)"
        >
          <div>
            <div class="merge-el-image">
              <img
                :width="item.w"
                :height="item.h"
                :src="item.url"
                alt=""
              >
            </div>
            <q-tooltip :ref="(el) => setRefMap(el, item)">
              {{item.id}}
            </q-tooltip>
            <q-menu
              touch-position
              context-menu
              auto-close
            >
              <q-list>
                <q-item
                  class="menu-item"
                  clickable
                  @click="onTopImg(item)"
                > {{ $t('moveToTop') }}</q-item>
                <q-item
                  class="menu-item"
                  clickable
                  @click="onVCenter(item)"
                > {{ $t('horizontalCenter') }}</q-item>
                <q-item
                  class="menu-item"
                  clickable
                  @click="onHCenter(item)"
                >{{ $t('verticalCenter') }}</q-item>
                <q-item
                  class="menu-item"
                  clickable
                  @click="onAllCenter(item)"
                > {{ $t('center') }}</q-item>
                <q-item
                  class="menu-item"
                  clickable
                  @click="onDeletePanelEl(index)"
                >{{ $t('delete') }}</q-item>
              </q-list>
            </q-menu>
          </div>
        </VueDraggableResizable>
      </div>
    </div>
    <div style="margin-top:10px">{{$t("intro.merge")}}</div>
  </div>
</template>

<script setup>
import { downloadImage, fileToBase64, getImageWidth, getNewID, getTempName, getTextWH, imgUrlTobase64, notify, openFileDialog, saveBase64Image } from "src/utils";
import { nextTick, onMounted, ref } from "vue";
import VueDraggableResizable from 'vue-draggable-resizable'
import "vue-draggable-resizable/style.css";
import miCheckbox from "src/components/form/mi-checkbox.vue"
import miInput from "src/components/form/mi-input.vue"
import miButton from "src/components/form/mi-button.vue"
import colorPicker from "src/components/color-picker.vue"
import html2canvas from 'html2canvas';
import { useUserStore } from "src/stores/user";
import { useQuasar } from "quasar"
const imageCollection = ref([])
const $q = useQuasar()
const pannelElList = ref([])

const addUseText = ref("")

const user = useUserStore()

const topIndex = ref(900)

const addLoading = ref(false)

const fontSetting = ref({
  fontSize: 14,
  maxWidth: 150,
  color: "#000000",
  backgroundColor: "#ffffff",
  isTransparent: true
})

const designOption = ref({
  backgroundColor: "#ffffff",
  isTransparent: true,

})

const paperSetting = ref({
  width: 500,
  height: 500,
  showWidth: 500,
  showHeight: 500
})

const saveImage = () => {
  const canvas = document.createElement("canvas")
  pannelElList.value.sort((a, b) => a.zIndex - b.zIndex)
  const mergePanel = refMap["mergePanel"]
  const boxW = mergePanel.offsetWidth
  const boxH = mergePanel.offsetHeight
  const { width, height } = paperSetting.value
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  let i = 0, imgFns = []
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pannelElList.value.forEach(item => {
    let { x, y, w, h, url } = item
    let imgX = x, imgY = y
    if (width < boxW) {
      imgX = x - (boxW - width) / 2
    } else {
      imgX = x + (width - boxW) / 2
    }
    if (height < boxH) {
      imgY = y - (boxH - height) / 2
    } else {
      imgY = y + (height - boxH) / 2
    }
    const image = new Image(w, h)
    image.src = url
    imgFns.push(() => ctx.drawImage(image, imgX, imgY, image.width, image.height))
    image.onload = function () {
      i++
      if (i >= pannelElList.value.length) {
        imgFns.forEach(fn => fn())
        // if (!user.isLogin) {
        //   notify($t("loginRmMark"))
        //   var backgroundColor = "rgba(0, 0, 0, 0.5)"; // 半透明黑色
        //   var textColor = "white";
        //   ctx.fillStyle = backgroundColor
        //   ctx.fillRect(canvas.width - 120, canvas.height - 35, 100, 25);
        //   ctx.fillStyle = textColor;
        //   ctx.fillText("yunren.online", canvas.width - 100, canvas.height - 20)
        // }
        let canvasRes = canvas.toDataURL("image/png")
        saveBase64Image(canvasRes)
      }
    }
  })

}

//修改宽高
const onChangePaperSet = () => {
  nextTick(() => {
    const mergePanel = refMap["mergePanel"]
    const boxW = mergePanel.offsetWidth
    const boxH = mergePanel.offsetHeight
    let { width, height, showWidth, showHeight } = paperSetting.value
    showWidth = width
    showHeight = height
    if (width < 50) {
      showWidth = 50
      paperSetting.value.width = 50
    }
    if (height < 50) {
      showHeight = 50
      paperSetting.value.height = 50
    }
    const maxW = 3000, maxH = 3000
    if (width > maxW) {
      paperSetting.value.width = maxW
    }
    if (height > maxH) {
      paperSetting.value.height = maxH
    }
    if (width > boxW) {
      showWidth = boxW
    }
    if (height > boxH) {
      showHeight = boxH
    }

    paperSetting.value.showWidth = showWidth
    paperSetting.value.showHeight = showHeight
  })
}

//初始化
const init = async () => {
  let { err, result, w, h } = await imgUrlTobase64("/images/sucai.png")
  imageCollection.value = []
  pushCollection("material1", result, w, h)

}

//水平居中
const onVCenter = (item) => {
  const mergePanel = refMap["mergePanel"]
  const boxW = mergePanel.offsetWidth
  const { w } = item
  item.x = boxW / 2 - w / 2
}

//水平居中
const onHCenter = (item) => {
  const mergePanel = refMap["mergePanel"]
  const boxH = mergePanel.offsetHeight
  const { h } = item
  item.y = boxH / 2 - h / 2
}

//全部居中
const onAllCenter = (item) => {
  onVCenter(item)
  onHCenter(item)
}

//添加文字
const onAddText = () => {
  if (addUseText.value) {
    addLoading.value = true
    let whEl = getTextWH(
      addUseText.value,
      fontSetting.value.fontSize + "px",
      fontSetting.value.maxWidth,
      fontSetting.value.color,
      fontSetting.value.isTransparent ? "transparent" : fontSetting.value.backgroundColor
    )

    html2canvas(whEl.el, { backgroundColor: "transparent", removeContainer: true, }).then((canvas) => {
      const base64 = canvas.toDataURL("image/png")
      pannelElList.value.push({
        id: addUseText.value + "_" + getNewID(),
        x: 0,
        y: 0,
        w: whEl.w,
        h: whEl.h,
        url: base64,
        zIndex: pannelElList.value.length
      })
      addLoading.value = false
      // whEl.el.remove()
      addUseText.value = ""
    }).catch(e => {
      addLoading.value = false
      notify($t("addFail"))
    })
  } else {
    notify($t("text can not be empty"), "warning")
  }
}

//删除画布图片
const onDeletePanelEl = (index) => {
  pannelElList.value.splice(index, 1)
}

//删除素材
const deleteCollection = (index) => {
  imageCollection.value.splice(index, 1)
}

//插入素材
const pushCollection = (title, url, w, h) => {
  const mergePanel = refMap["mergePanel"]
  const boxW = mergePanel.offsetWidth
  const boxH = mergePanel.offsetHeight
  if (w > boxW) {
    h = h * (boxW / w)
    w = boxW
  }
  if (h > boxH) {
    w = w * (boxH / h)
    h = boxH
  }
  imageCollection.value.push({
    title,
    url,
    w,
    h,
  })
}

//上传图片
const uploadImg = async () => {
  const files = await openFileDialog(true, 3 * 1024 * 1024, "image/jpg,image/png, image/jpeg,image/webp")
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let { err, result } = await fileToBase64(file)
    getImageWidth(result, (w, h) => {
      pushCollection(file.name, result, w, h)
    })
  }
}

//refs
const refMap = {}
const setRefMap = (el, item) => {
  if (el) {
    refMap[`${item.id}`] = el
  }
}

//选择素材
const collectionSelect = (item) => {
  pannelElList.value.push({
    id: item.title + "_" + getNewID(),
    x: 0,
    y: 0,
    w: item.w,
    h: item.h,
    url: item.url,
    zIndex: pannelElList.value.length
  })
}

const onTopImg = (item) => {
  item.zIndex = topIndex.value
  topIndex.value++
}

//大小改变
const onResizeCallback = (item, handle, x, y, width, height) => {
  Object.assign(item, {
    w: width,
    h: height,
    x,
    y
  })

}
//拖拽
const onDragCallback = (item, x, y) => {
  refMap[`${item.id}`].updatePosition()
  Object.assign(item, {
    x,
    y
  })
}

const checkElNoOut = () => {
  const mergePanel = refMap["mergePanel"]
  const boxW = mergePanel.offsetWidth
  const boxH = mergePanel.offsetHeight
  pannelElList.value.some(item => {
    if (item.x + item.w > boxW) {
      item.x = boxW - item.w
    }
    if (item.y + item.h > boxH) {
      item.y = boxH - item.h
    }
  })
}
onMounted(() => {
  if ($q.platform.is.mobile) {
    notify($t("onlyPC"))
  }
  onChangePaperSet()
  const resizeWin = () => {
    onChangePaperSet()
    checkElNoOut()
  }
  window.removeEventListener("resize", resizeWin)
  window.addEventListener("resize", resizeWin)
})

init()


</script>

<style lang="scss" scoped>
.merge-page {
  margin-top: 20px;
  padding: 10px;
  .options {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    flex-wrap: wrap;
    .options-back-ipt {
      display: inline-block;
      width: 150px;
    }
    .options-row {
      display: flex;
      align-items: center;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .page-pannel {
    display: flex;
    flex-wrap: wrap;
    height: calc(100vh - 220px);
    .merge-left-imgCollect {
      width: 220px;
      margin-right: 10px;

      overflow: hidden;
      overflow-y: auto;
      .img-item {
        position: relative;
        width: 80%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        border: 1px solid #aaa;
        cursor: pointer;
        margin-bottom: 10px;
        .img {
          width: 100%;
          height: 98px;
          object-fit: scale-down;
        }
        .close-btn {
          cursor: pointer;
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(50%, -50%);
        }
      }
      .upload-btn {
        img {
          width: 50px !important;
          height: 50px !important;
        }
      }
    }
    .img-merge-pannel {
      position: relative;
      min-width: 350px;
      width: calc(100% - 280px);
      border-radius: 4px;
      border: 1px solid #aaa;
      margin-right: 20px;
      .vdr {
        border: none;
      }
      .save-box {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid #eee;
        box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2),
          inset -2px -2px 5px rgba(255, 255, 255, 0.5);
      }
    }
  }
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
