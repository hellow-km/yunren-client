<template>
  <div class="sprite-make-page">
    <!-- <div class="page-upload">
      <miUpload
        :maxSize="5*1024*1024"
        @getFiles="getFiles"
        :height="120"
        :width="420"
        accept="image/jpg,image/png, image/jpeg,image/webp"
      ></miUpload>
    </div> -->
    <div style="margin-top:10px;text-align:center">{{$t("intro.SpriteMake")}}</div>
    <div style="text-align:center">{{$t("Please ensure that the original width or set width of the image does not exceed the paper-width padding width of the drawing")}}</div>
    <div class="page-options">
      <div style="text-align:center">
        <div class="option-grid">
          <span>{{$t("Picture count")}}:</span>
          <miInput
            type="number"
            class="ipt-inline"
            input-class="opt-ipt-center"
            v-model="headOptions.num"
          ></miInput>
          <span>{{$t("Paper width")}}:</span>
          <miInput
            type="number"
            class="ipt-inline"
            input-class="opt-ipt-center"
            v-model="headOptions.paperWidth"
          ></miInput>
        </div>
        <div class="option-split">
          <span>{{$t("Cols margin")}}:</span>
          <miInput
            type="number"
            class="ipt-inline"
            input-class="opt-ipt-center"
            v-model="headOptions.colSplit"
          ></miInput>
          <span>{{$t("Rows margin")}}:</span>
          <miInput
            type="number"
            class="ipt-inline"
            input-class="opt-ipt-center"
            v-model="headOptions.rowSplit"
          ></miInput>
          <div style="margin-top:15px">
            <miButton
              @click="addColumns"
              :label="$t('Render columns')"
            ></miButton>
            <miButton
              :disabled="!spriteData.length"
              style="margin-left:10px"
              :label="$t('Add column')"
              @click="addOneCol"
            ></miButton>
            <miButton
              :disabled="!spriteData.length"
              style="margin-left:10px"
              :label="$t('multi upload')"
              @click="multiUpload"
            ></miButton>
            <span style="margin-left:10px">
              <miButton
                :disabled="!spriteData.length"
                :label="$t('Setting all')"
              ></miButton>
              <q-menu touch-position>
                <div style="padding:20px">
                  <miCheckbox
                    v-model="allConfig.isOrgin"
                    :label="$t('Is origin size')"
                  ></miCheckbox>
                  <div v-show="!allConfig.isOrgin"><span>{{$t("width and height")}}:</span>
                    <miInput
                      class="ipt-inline"
                      input-class="opt-ipt-center"
                      type="number"
                      v-model="allConfig.width"
                    ></miInput>
                    <span>x</span>
                    <miInput
                      class="ipt-inline"
                      input-class="opt-ipt-center"
                      type="number"
                      v-model="allConfig.height"
                    ></miInput>
                  </div>
                  <div style="margin-top:15px">
                    <miButton
                      :label="$t('setting')"
                      @click="settingAll"
                    ></miButton>
                  </div>
                </div>
              </q-menu>
            </span>
            <span style="margin-left:10px">
              <miButton
                :disabled="!spriteData.length"
                @click="setImagePosition"
                :label="$t('layout and preview')"
              ></miButton>
              <q-menu touch-position>
                <div style="padding:20px">
                  <miRadiu
                    :data="[{value:'1',label:$t('Full layout')}]"
                    v-model="positionConfig.mode"
                  ></miRadiu>
                  <!-- <div><span>一行数量</span>
                  <miInput
                    class="ipt-inline"
                    input-class="opt-ipt-center"
                    type="number"
                    v-model="positionConfig.num"
                  ></miInput>
                </div> -->
                  <div style="margin-top:15px">
                    <miButton
                      :label="$t('preview')"
                      @click="previewDialogVisible=true"
                    ></miButton>
                    <q-tooltip>
                      {{$t("Please ensure that the original width or set width of the image does not exceed the paper-width padding width of the drawing")}}
                    </q-tooltip>
                  </div>
                </div>
              </q-menu>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="page-content"
      ref="pageContent"
    >
      <div
        class="content-box"
        :style="{
         // padding:`0 0 ${headOptions.rowSplit}px ${headOptions.colSplit}px`
        }"
      >
        <template
          v-for="(item,index) in spriteData"
          :key="index"
        >
          <div
            class="content-col"
            v-for="(_item,_index) in item"
            :key="_index"
          >
            <div
              class="col-img-box"
              :style="{
                width:'100px',
                height:'100px',
                margin:`0 ${headOptions.colSplit}px ${headOptions.rowSplit}px 0`
              }"
            >
              <q-menu
                touch-position
                context-menu
                v-model="_item.itemMenuVisible"
              >
                <div>
                  <div
                    v-if="_item.src"
                    style="padding:10px"
                  >
                    <div><span>{{$t("origin size")}}&nbsp;</span><span>{{_item.orginW}}x{{_item.orginH}}</span></div>
                    <div>
                      <miCheckbox
                        v-model="_item.isOrgin"
                        :label="$t('use the origin size')"
                      ></miCheckbox>
                    </div>
                    <div v-show="!_item.isOrgin">
                      <mi-input
                        class="ipt-inline"
                        type="number"
                        input-class="opt-ipt-center"
                        v-model="_item.width"
                      ></mi-input>
                      <span>x</span>
                      <mi-input
                        class="ipt-inline"
                        type="number"
                        input-class="opt-ipt-center"
                        v-model="_item.height"
                      ></mi-input>
                    </div>
                    <div style="margin-top:10px">
                      <miButton
                        color="red"
                        :label="$t('delete')"
                        @click="deleteSprite(index,_index);_item.itemMenuVisible=false"
                      ></miButton>
                      <miButton
                        style="margin-left:8px"
                        color="red"
                        :label="$t('clearImage')"
                        @click="clearUpload(index,_index)"
                      ></miButton>
                    </div>
                  </div>
                  <q-list v-else>
                    <q-item
                      clickable
                      @click="deleteSprite(index,_index);_item.itemMenuVisible=false"
                    >{{$t("delete")}}</q-item>
                    <q-item
                      clickable
                      @click="uploadImage(index,_index);_item.itemMenuVisible=false"
                    >{{$t("upload")}}</q-item>
                  </q-list>
                </div>
              </q-menu>
              <div
                v-if="_item.src"
                class="img-box-fill"
              >
                <img
                  width="100%"
                  height="100%"
                  :src="_item.src"
                  alt=""
                >
              </div>
              <div
                @click="uploadImage(index,_index)"
                class="img-box-no"
                v-else
              >
                <img
                  class="img"
                  width="30"
                  src="../../assets/images/common/add.png"
                  alt=""
                >
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <miDialog
      :width="headOptions.paperWidth+100"
      v-model="previewDialogVisible"
      showXScroll
    >
      <puprPreviewVue
        :data="spriteData"
        :colSplit="headOptions.colSplit"
        :rowSplit="headOptions.rowSplit"
        :paperWidth="headOptions.paperWidth"
      ></puprPreviewVue>
    </miDialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";
import miUpload from "src/components/form/mi-upload.vue";
import {
  downloadFile,
  formatFileSize,
  getTempName,
  notify,
  slowFastProgress,
  percent,
  downloadImage,
  downloadZip,
  openFileDialog,
  fileToBase64,
  getImageWidth,
} from "src/utils";
import miButton from "src/components/form/mi-button.vue";
import { compressImage } from "src/http";
import { maxImageCount } from "src/utils/image";
import { deleteImages, downloadAllImage } from "src/http/image";
import { validToken } from "src/http/user";
import miRadiu from "src/components/form/mi-radio.vue"
import miInput from "src/components/form/mi-input.vue"
import miCheckbox from "src/components/form/mi-checkbox.vue"
import miDialog from "src/components/mi-dialog.vue"
import puprPreviewVue from "../components/puprPreview.vue";
const $q = useQuasar()

const positionConfig = ref({
  mode: "1",
  num: 3
})

const headOptions = ref({
  col: 3,
  num: 9,
  colSplit: 5,
  rowSplit: 5,
  paperWidth: 1000
})

const allConfig = ref({
  width: 100,
  height: 100,
  isOrgin: true
})

const previewDialogVisible = ref(false)

const pageContent = ref(null)

const spriteData = ref([])

const settingAll = () => {
  spriteData.value.some(item => {
    item.some(_item => {
      if (allConfig.value.isOrgin) {
        _item.isOrgin = true
      } else {
        _item.isOrgin = false
        _item.width = allConfig.value.width
        _item.height = allConfig.value.height
      }
    })
  })
}


const multiUpload = () => {
  openFileDialog(true, 10 * 1024 * 1024, "image/png,image/jpg,image/jpeg,image/webp").then((files) => {
    files.forEach(file => {
      fileToBase64(file).then(({ err, result: base64 }) => {
        getImageWidth(base64, (w, h) => {
          let data = spriteData.value[0]
          data.some(item => {
            if (!item.src) {
              Object.assign(item, {
                src: base64,
                orginW: w,
                orginH: h,
              })
              return true
            }
          })
        })
      })
    })
  })
}

const addOneCol = () => {
  if (spriteData.value.length) {
    spriteData.value[spriteData.value.length - 1].push({ src: "", width: 100, height: 100, isOrgin: true })
  }
}

//添加上传栏
const addColumns = () => {
  const confirmFn = () => {
    let pageConten = pageContent.value
    spriteData.value = []
    let { num, colSplit, rowSplit } = headOptions.value
    // const col = Math.floor(pageConten.offsetWidth / (101 + headOptions.value.colSplit))
    for (let i = 0; i < num; i++) {
      // const row = Math.ceil(num / col)
      // if (i % col == 0) {
      //   spriteData.value.push([])
      // }
      spriteData.value.push([])
      spriteData.value[spriteData.value.length - 1].push({ src: "", width: 100, height: 100, isOrgin: true })
    }
  }
  if (spriteData.value.length) {
    $q.dialog({
      title: $t("delete"),
      message: $t("Confirm reRender the columns?"),
      ok: $t("confirm"),
      cancel: $t("cancel"),
      persistent: true
    }).onOk(() => {
      confirmFn()
    }).onCancel(() => {
      // console.log('>>>> Cancel')
    }).onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
  } else {
    confirmFn()
  }
}

const clearUpload = (i, i2) => {
  spriteData.value[i].splice(i2, 1, { src: "", width: 100, height: 100, isOrgin: true })
}

const deleteSprite = (i, i2) => {
  spriteData.value[i].splice(i2, 1)
}

const setImagePosition = () => {

}

//上传图片
const uploadImage = (rowI, colI) => {
  openFileDialog(false, 10 * 1024 * 1024, "image/png,image/jpg,image/jpeg,image/webp").then(files => {
    fileToBase64(files[0]).then(({ err, result: base64 }) => {
      getImageWidth(base64, (w, h) => {
        Object.assign(spriteData.value[rowI][colI], {
          src: base64,
          orginW: w,
          orginH: h,
        })
      })

    })
  })

}

</script>

<style lang="scss" scoped>
.sprite-make-page {
  .page-upload {
    display: flex;
    justify-content: center;
    margin: 20px 10px 0 10px;
  }
  .page-options {
    display: flex;
    justify-content: center;
    .option-grid {
    }
  }
  .page-content {
    width: 82%;
    height: 530px;
    margin: 10px auto;
    border: 1px solid #eee;
    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2),
      inset -2px -2px 5px rgba(255, 255, 255, 0.5);
    padding: 5px;
    overflow: auto;
    .content-box {
      margin: auto;
      padding: 1px 0 0 1px;
      display: flex;
      flex-wrap: wrap;
      .content-col {
        .col-img-box {
          border: 1px solid #aaa;
          box-sizing: border-box;
          .img-box-fill {
            position: relative;
            width: 100%;
            height: 100%;
          }
          .img-box-no {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
        }
      }
    }
  }
  .page-content-flyout {
    // position: fixed;
    // left: -3000px;
    border: none !important;
    .col-img-box {
      border: none !important;
    }
    box-shadow: none;
  }
}
</style>
