<template>
  <div class="content-item">
    <div class="page-upload">
      <miUpload
        :maxSize="5*1024*1024"
        @getFiles="getFiles"
        accept="image/jpg,image/png, image/jpeg"
        :isMulti="false"
      ></miUpload>
    </div>

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
} from "src/utils";
import miButton from "src/components/form/mi-button.vue";
import { compressImage } from "src/http";
import { maxImageCount } from "src/utils/image";
import { deleteImages, downloadAllImage } from "src/http/image";
import { validToken } from "src/http/user";
import { personPhoto } from "src/http/doModel"
const tableFiles = ref([]);

const taskID = ref(getTempName());

const quality = ref(4);

//文件上传
const getFiles = async (files) => {
  let res = await validToken();
  if (res.code != 0) {
    return;
  }
  //'taskID', 'width', 'height'
  let res2 = await personPhoto(files, {
    taskID: taskID.value,
    width: 300,
    height: 500
  })
  console.log("res", res2);
};

const isComplete = computed(() => {
  return tableFiles.value.every((item) => item.state === 1);
});

//更新某列
const updateTableFiles = (ID, data) => {
  return tableFiles.value.find((item) => {
    if (item.ID == ID) {
      Object.assign(item, data);
      return true;
    }
  });
};

const download = (file) => {
  downloadImage(file.name, file.url);
};

const downloadAllFiles = async () => {
  let { data } = await downloadAllImage({ taskID: taskID.value });
  downloadZip("images", data.url);
};

onMounted(() => {
  window.addEventListener("beforeunload", function (event) {
    deleteImages({ taskID: taskID.value });
  });
});

onBeforeUnmount(async () => {
  let res = await deleteImages({ taskID: taskID.value });
});

</script>

<style lang="scss" scoped>
.content-item {
  .page-upload {
    display: flex;
    justify-content: center;
    margin: 20px 10px 0 10px;
  }
}
</style>
