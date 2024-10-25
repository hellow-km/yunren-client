<template>
  <div class="content-item">
    <div class="page-upload">
      <miUpload
        :maxSize="5*1024*1024"
        @getFiles="getFiles"
        accept="image/*"
      ></miUpload>
    </div>
    <div style="margin-top:10px">{{$t("intro.convert")}}</div>
    <div class="page-options">
      <div class="page-options-item">
        <span>{{ $t('imageType') }}</span>
        <miSelect
          style="width:150px"
          v-model="option.ext"
          :options="selectOptions"
        ></miSelect>
        <span style="margin:0 15px">旋转角度</span>
        <miInput
          v-model="option.rotate"
          type="number"
          style="width:60px;"
        ></miInput>°
        <miCheckbox
          label="原图大小"
          v-model="option.isOrign"
        ></miCheckbox>
        <div
          style="display:flex;align-items:center"
          v-show="!option.isOrign"
        >
          <span style="margin:0 15px">宽高</span>
          <miInput
            v-model="option.width"
            type="number"
            input-style="text-align:center"
            style="width:60px;"
            maxlength="4"
          ></miInput>x
          <miInput
            v-model="option.height"
            type="number"
            style="width:60px;"
            input-style="text-align:center"
            maxlength="4"
          ></miInput>
        </div>
        <miButton
          class="start-btn"
          v-if="tableFiles.length&&option.ext"
          @click="startConvert()"
          :label="$t('startConversion')"
          color="primary"
        ></miButton>
      </div>
    </div>
    <div
      class="page-table"
      v-if="tableFiles.length"
    >
      <div
        class="table-item"
        v-for="(item,index) in tableFiles"
        :key="index"
      >
        <div class="table-item-col table-item-col-1">
          {{item.name}}
        </div>
        <div class="table-item-col table-item-col-2">
          {{formatFileSize(item.size)}}
        </div>

        <div class="table-item-col table-item-col-3">
          <q-linear-progress
            :animation-speed="50"
            dark
            stripe
            rounded
            size="20px"
            :value="Number(item.progress)"
            color="secondary"
          >
            <div class="absolute-full flex flex-center">
              <q-badge
                v-if="state!=2"
                color="white"
                text-color="secondary"
                :label="item.progressLabel+'%'"
              />
              <q-badge
                v-else
                color="red"
                text-color="white"
                :label="$t('conversionFailed')"
              ></q-badge>
            </div>
          </q-linear-progress>
        </div>
        <div class="table-item-col table-item-col-4">
          <q-badge
            color="green"
            v-if="item.ext&&item.newExt"
          >
            {{item.ext}} => {{item.newExt}}
          </q-badge>

          <q-badge
            style="margin-left:8px"
            color="blue"
          >
            {{item.newSize?formatFileSize(item.newSize):""}}
          </q-badge>
        </div>
        <div class="table-item-col table-item-col-5">
          <miButton
            class="col-download-btn"
            v-if="item.progress>=1&&item.state===1"
            @click="download(item)"
            :label="$t('download')"
            flat
          ></miButton>
        </div>
      </div>
    </div>
    <div class="table-footer-opt">
      <miButton
        class="col-download-btn"
        v-if="tableFiles.length&&isComplete"
        @click="downloadAllFiles"
        :label="$t('downloadAll')"
        color="secondary"
      ></miButton>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
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
  getFilepathIdentify,
} from "src/utils";
import miButton from "src/components/form/mi-button.vue";
import miSelect from "src/components/form/mi-select.vue";
import { compressImage } from "src/http";
import { maxImageCount } from "src/utils/image";
import { convertImage, deleteImages, downloadAllImage } from "src/http/image";
import { validToken } from "src/http/user";
import miInput from "src/components/form/mi-input.vue";
import miCheckbox from "src/components/form/mi-checkbox.vue";
const tableFiles = ref([]);

const option = ref({
  ext: "jpg",
  rotate: "0",
  width: 500,
  height: 500,
  isOrign: true,
});

const taskID = ref(getTempName());

const quality = ref(4);

const selectOptions = ref([
  { value: "jpg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "webp", label: "WEBP" },
  { value: "jpeg", label: "JPEG" },
  { value: "ico", label: "ICO" },
]);

//文件上传
const getFiles = async (files) => {
  // let res = await validToken();
  // if (res.code != 0) {
  //   return;
  // }
  let timer = null;
  let isClear = false;
  files.forEach((file, index) => {
    let obj = {
      ID: tableFiles.value.length,
      taskID: taskID.value,
      name: file.name,
      size: file.size,
      newSize: 0,
      progress: 0,
      progressLabel: 0,
      state: 0,
      file: file,
    };
    if (tableFiles.value.length < maxImageCount) {
      if (
        !tableFiles.value.find(
          (item) => item.name == file.name && item.size == file.size
        )
      ) {
        if (!isClear) {
          tableFiles.value = [];
          isClear = true;
        }
        tableFiles.value.push(obj);
      }
    } else {
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        notify($t("overTen"));
      }, 500);
    }
  });
};

const isComplete = computed(() => {
  return tableFiles.value.every((item) => item.state === 1);
});

//开始转换
const startConvert = async () => {
  let files = tableFiles.value; //.filter((file) => file.state === 0);
  files.some((file) => {
    //转换中
    file.state = 3;
    excuteConvert(file);
  });
  let { data } = await convertImage(
    files,
    option.value.ext,
    option.value.rotate,
    option.value.isOrign ? "" : option.value.width,
    option.value.isOrign ? "" : option.value.height
  );
  data.forEach((item) => {
    let file = updateTableFiles(item.ID, item);
    stopProgress(file);
  });
};
//state 0未开始 1成功 2失败 3转换中
//停止增加并完成
const stopProgress = (file) => {
  file.timer && clearInterval(file.timer);
  if (file.state === 1) {
    file.progress = 1;
    file.progressLabel = 100;
  }
};

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
  let identify = getFilepathIdentify(file.name);
  downloadImage(identify.fileNameNoExt + "." + option.value.ext, file.url);
};

const downloadAllFiles = async () => {
  let { data } = await downloadAllImage({ taskID: taskID.value });
  downloadZip("images", data.url);
};

//进度条
const excuteConvert = (file) => {
  try {
    file.timer && clearInterval(file.timer);
    file.timer = slowFastProgress(
      (progress) => {
        file.progressLabel = progress.toFixed(2);
        file.progress = progress / 100;
      },
      0,
      99
    );
  } catch (e) {
    console.log("ee", e);
    file.timer && clearInterval(file.timer);
  }
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
  padding: 10px;
  .page-upload {
    display: flex;
    justify-content: center;
    margin: 20px 10px 0 10px;
  }
  .page-options {
    margin: 15px 0;
    .page-options-item {
      flex-wrap: wrap;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 10px;
    }
    .start-btn {
      margin-left: 10px;
    }
  }
  .page-table {
    margin-top: 15px;
    border: 1px solid #bbcbd0;
    padding: 5px 10px;
    .table-item {
      display: flex;
      align-items: center;
      background-color: #f0f0f0;
      padding: 5px 10px;
      height: 30px;
      &:not(:first-child) {
        margin-top: 5px;
      }
      &-col {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &-col-1 {
        width: 30%;
      }
      &-col-2 {
        width: 8%;
        min-width: 60px;
      }
      &-col-3 {
        width: 30%;
      }
      &-col-4 {
        min-width: 130px;
        width: 20%;
        margin-left: 10px;
        display: flex;
        align-items: center;
      }
      &-col-5 {
        min-width: 50px;
        // width: 8%;
      }
    }
    .col-download-btn {
      min-height: 25px;
      height: 25px;
      line-height: 16px;
    }
  }
  .table-footer-opt {
    text-align: center;
    margin-top: 15px;
  }
}
</style>
