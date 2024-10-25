<template>
  <div
    @click="openUpload"
    class="upload-box"
    :style="{
      width: width+'px',
      height:height+ 'px'
    }"
  >
    <slot>
      <div class="upload-opt">
        <div class="upload-tip">{{$t(tip)}}，{{$t("lessThen")}} {{formatFileSize(maxSize)}}</div>
        <miButton :label="$t('clickToUpload')"></miButton>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { config } from "src/config";
import miButton from "./mi-button.vue";
import { openFileDialog, formatFileSize } from "src/utils";
const props = defineProps({
  events: {
    type: Object,
    default: () => ({}),
  },
  attrs: {
    type: Object,
    default: () => ({}),
  },
  width: {
    type: Number,
    default: 500,
  },
  height: {
    type: Number,
    default: 200,
  },
  tip: {
    type: String,
    default: "clickOrDragUpload",
  },
  maxSize: {
    type: Number,
    default: 3 * 1024 * 1024,
  },
  accept: {
    type: String,
    default: "image/*",
  },
  isMulti: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["getFiles"]);
const openUpload = async () => {
  openFileDialog(props.isMulti, props.maxSize, props.accept).then((files) => {
    emit("getFiles", files);
  });
};
const serverUrl = ref(config.serverUrl + "upload");
</script>

<style lang="scss" scoped>
.upload-box {
  cursor: pointer;
  border: 1px dashed rgba(55, 55, 55, 0.5);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  .upload-opt {
    text-align: center;
  }
  .upload-tip {
    font-size: 20px;
    margin-bottom: 15px;
  }
}
</style>
