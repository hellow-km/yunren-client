<template>
  <div class="textzimg-page">
    <div class="options">
      <div>
        <div class="options-row row-noCenter">
          <span>{{ $t('text') }}</span>
          <miInput
            type="textarea"
            v-model="addUseText"
            :borderless="false"
            outlined
          ></miInput>
        </div>
        <div class="options-row">
          <span>{{ $t('width') }}</span>
          <mi-input
            v-model="fontSetting.maxWidth"
            input-class="opt-ipt-center"
          ></mi-input>px
          <span style="margin-left:10px">{{ $t('fontSize') }}<span>{{fontSetting.fontSize}}px</span></span>
          <q-slider
            class="opt-slide"
            v-model="fontSetting.fontSize"
            :min="12"
            :max="50"
          />
        </div>
        <div class="options-row">
          <span>{{ $t('fontColor') }}</span>
          <colorPicker v-model="fontSetting.color">
          </colorPicker>
          <span style="margin-left:5px">{{ $t('fontBgColor') }}</span>
          <colorPicker v-model="fontSetting.backgroundColor">
          </colorPicker>
          <miCheckbox
            v-model="fontSetting.isTransparent"
            :label="$t('transparentBackground')"
          ></miCheckbox>
        </div>
        <div class="options-row">
          <miButton
            style="margin-left:15px"
            @click="onAddText"
            :label="'preview'"
            :loading="addLoading"
          ></miButton>
          <miButton
            style="margin-left:15px"
            @click="download"
            :label="'download'"
            :loading="addLoading"
          ></miButton>
        </div>
      </div>
    </div>
    <div class="preview">
      <img
        class="preview-img"
        v-if="imgConfig.src"
        :src="imgConfig.src"
        :width="imgConfig.w"
        :height="imgConfig.h"
        alt=""
      >
    </div>
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

const $q = useQuasar()

const addUseText = ref("")

const user = useUserStore()

const addLoading = ref(false)

const fontSetting = ref({
  fontSize: 14,
  maxWidth: 150,
  color: "#000000",
  backgroundColor: "#ffffff",
  isTransparent: true
})

const imgConfig = ref({
  src: "",
  w: 0,
  h: 0
})

const download = () => {
  if (addUseText.value) {
    onAddText()
    if (imgConfig.value.src) {
      saveBase64Image(imgConfig.value.src)
    }
  } else {
    notify($t("text can not be empty"), "warning")
  }
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
    html2canvas(whEl.el, { backgroundColor: "transparent", removeContainer: true }).then((canvas) => {
      const base64 = canvas.toDataURL("image/png")
      imgConfig.value.src = base64
      imgConfig.value.w = whEl.w
      imgConfig.value.h = whEl.h
      addLoading.value = false
      // whEl.el.remove()
    }).catch(e => {
      addLoading.value = false
      notify($t("addFail"))
    })
  } else {
    notify($t("text can not be empty"), "warning")
  }
}

//refs
const refMap = {}
const setRefMap = (el, item) => {
  if (el) {
    refMap[`${item.id}`] = el
  }
}

onMounted(() => {
  if ($q.platform.is.mobile) {
    notify($t("onlyPC"))
  }
})

</script>

<style lang="scss" scoped>
.textzimg-page {
  margin-top: 20px;
  .options {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    .options-back-ipt {
      display: inline-block;
      width: 100%;
      margin-left: 10px;
    }
    .options-row {
      display: flex;
      align-items: center;
      margin-right: 10px;
      margin-top: 15px;
      white-space: nowrap;
    }
    .row-noCenter {
      align-items: start;
    }
    .opt-slide {
      display: inline-block;
      width: 150px;
      margin: 0 10px;
    }
  }
  .preview {
    margin-top: 15px;
    text-align: center;
  }
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
