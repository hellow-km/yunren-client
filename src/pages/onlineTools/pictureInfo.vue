<template>
  <div class="content-item">
    <div class="page-upload">
      <miUpload
        :maxSize="5*1024*1024"
        @getFiles="getFiles"
        accept="image/jpg,image/png, image/jpeg,image/webp"
        :isMulti="false"
      ></miUpload>
    </div>
    <div class="picture-info">
      <labelValue
        v-for="(value,key) in infos"
        :key="key"
        :title="key"
        :label="value"
      ></labelValue>
    </div>
  </div>
</template>

<script setup lang="ts">
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
} from "src/utils";
import miButton from "src/components/form/mi-button.vue";
import { validToken } from "src/http/user";
import { identifyImage } from "src/http/image";
import labelValue from "../components/labelValue.vue";

const taskID = ref(getTempName());

const infos = ref({
  [$t("format")]: "",
  [$t("resolution")]: "",
  [$t("colorCount")]: "",
  [$t("size")]: "",
  [$t("colorDepth")]: "",
  [$t("pixels")]: "",
  [$t("quality")]: "",
  [$t("signature")]: "",
});

//文件上传
const getFiles = async (files) => {
  let res = await validToken();
  if (res.code != 0) {
    return;
  }
  let identifyRes = await identifyImage(files, taskID.value);

  let identData = identifyRes.data.split("\r\n");
  identData.forEach((item) => {
    let lValue = item.split(":");
    infos.value[$t(lValue[0])] = lValue[1];
  });
  infos.value[$t("size")] = formatFileSize(parseInt(infos.value[$t("size")]));
};

onMounted(() => {
  window.addEventListener("beforeunload", function (event) {});
});

onBeforeUnmount(async () => {});
</script>

<style lang="scss" scoped>
.content-item {
  .page-upload {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .picture-info {
    margin-top: 15px;
  }
}
</style>
