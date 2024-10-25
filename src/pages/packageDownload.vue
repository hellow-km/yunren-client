<template>
  <div class="package-page">
    <div class="download-head">
      <miButton
        label="添加一行"
        @click="addRow"
      ></miButton>
      <span style="margin-left:10px">
        <miButton
          label="添加磁力链"
          @click="addTorrent"
        ></miButton>
        <span>
          <img
            width="16"
            :src="localImages.tip"
            alt=""
          >
          <q-tooltip>
            磁力链下载只能通过此入口添加
          </q-tooltip>
        </span>
        <q-menu>
          <div style="padding:15px">
            <mi-input
              type="textarea"
              style="width:500px;word-break: break-all;white-space: pre;"
              placeholder="磁力链链接"
              border
              v-model="torrentLink"
            ></mi-input>
            <miButton
              style="margin-top:10px"
              :label="$t('confirm')"
              @click="onSubmitTorrent"
            ></miButton>
          </div>
        </q-menu>
      </span>
      <span style="margin-left:10px">
        <miButton label="批量导入链接"></miButton>
        <q-menu>
          <div style="padding:15px">
            <mi-input
              type="textarea"
              style="width:500px;word-break: break-all;white-space: pre;"
              placeholder="多个链接用;分割，例：
https://nodejs.org/dist/v20.14.0/node-v20.14.0-x64.msi;
https://www.yunren.online/example.txt"
              border
              v-model="linkValue"
            ></mi-input>
            <miButton
              style="margin-top:10px"
              :label="$t('confirm')"
              @click="onSubmitLink"
            ></miButton>
          </div>
        </q-menu>
      </span>
      <miCheckbox
        @update:model-value="onChangeIsDelete"
        v-model="isDeleteFile"
        label="删除列表时同时删除文件"
      ></miCheckbox>
    </div>
    <div class="download-content">
      <q-table
        :rows="urlList"
        :columns="columns"
        row-key="name"
        hide-bottom
      >
        <template v-slot:body-cell-url="props">
          <q-td>
            <miInput
              clearable
              :placeholder="props.row.isTorrent?'输入磁力链接':'示例:https://nodejs.org/dist/v20.14.0/node-v20.14.0-x64.msi'"
              :disable="props.row.state!='1'"
              v-model="props.row.url"
            ></miInput>
          </q-td>
        </template>
        <template v-slot:body-cell-progress="props">
          <q-td>
            <miPorgress v-model="props.row.progress"></miPorgress>
          </q-td>
        </template>
        <template v-slot:body-cell-state="props">
          <q-td align="center">
            <span :style="{color:getStateLabel(props.row.state).color}">
              {{getStateLabel(props.row.state).text}}
              <span v-show="props.row.state=='4'&&props.row.message">:{{props.row.message}}</span></span>
          </q-td>
        </template>
        <template v-slot:body-cell-operate="props">
          <q-td align="center">
            <miButton
              v-show="props.row.state=='1'"
              @click="onStartDownload(props.row)"
              style="color:#21BA45 !important"
              flat
              label="开始下载"
            ></miButton>
            <miButton
              style="color:#F2C037 !important"
              v-show="props.row.state=='2'"
              flat
              @click="pauseDownload(props.row)"
              label="暂停下载"
            ></miButton>
            <miButton
              style="color:#F2C037 !important"
              v-show="props.row.state=='6'"
              flat
              @click="resumeDownload(props.row)"
              label="继续下载"
            ></miButton>
            <miButton
              style="color:#F2C037 !important"
              v-show="props.row.state=='2'||props.row.state=='6'"
              flat
              @click="cancelDownload(props.row)"
              label="取消"
            ></miButton>
            <miButton
              v-show="props.row.state=='3'||props.row.state=='4'||props.row.state=='1'"
              flat
              style="color:#ff0000 !important"
              @click="deleteDownload(props.row,props.rowIndex)"
              label="删除"
            ></miButton>
            <miButton
              v-show="props.row.state=='3'"
              @click="openDownloadFolder(props.row)"
              style="color:#21BA45 !important"
              flat
              label="打开文件夹"
            ></miButton>
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script setup>
import miInput from "src/components/form/mi-input.vue"
import miButton from "src/components/form/mi-button.vue"
import miDialog from "src/components/mi-dialog.vue"
import miCheckbox from "src/components/form/mi-checkbox.vue"
import miPorgress from "src/components/mi-progress.vue"
import { localImages } from "src/utils/images"
import { nextTick, onBeforeUnmount, onMounted, onUnmounted, ref } from "vue"
import { getNewID, notify, proxyToObj } from "src/utils"
import { useQuasar } from "quasar"

const $q = useQuasar()
const { onReceiveMessage, sendMessage, openPath, getDownloadsFile, openFolder, openDownloadPath } = window.api
const linkValue = ref("")
const columns = ref([
  { name: 'url', align: "center", headerStyle: "width:50%", label: '资源地址', width: 300, field: 'url' },
  { name: 'progress', align: "center", headerStyle: "width:10%", label: '进度', field: 'progress' },
  { name: 'state', align: "center", headerStyle: "width:10%", label: '下载状态', field: 'state' },
  { name: 'speed', align: "center", headerStyle: "width:5%", label: '下载速度', field: 'speed' },
  { name: 'operate', align: "center", headerStyle: "width:25%", label: '操作', field: 'operate' },
])

const isDeleteFile = ref(localStorage.getItem("isDeleteFile") ? true : false)
//magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent
const torrentLink = ref("")

defineOptions({
  name: 'packageDownload'
});

//勾选是否删除
const onChangeIsDelete = () => {
  nextTick(() => {
    localStorage.setItem("isDeleteFile", isDeleteFile.value)
  })
}

//添加磁力链
const onSubmitTorrent = () => {
  urlList.value.push(getDefaultRow(torrentLink.value.trim(), true))
}

//获取状态字段
const getStateLabel = (state) => {
  let resultObj = { text: "", color: "" }
  switch (state) {
    case "1":
      resultObj = { text: "等待下载", color: "#333333" }
      break;
    case "2":
      resultObj = { text: "正在下载", color: "#F2C037" }
      break;
    case "3":
      resultObj = { text: "成功", color: "#21BA45" }
      break;
    case "4":
      resultObj = { text: "失败", color: "#ff0000" }
      break;
    case "5":
      resultObj = { text: "取消", color: "#ff0000" }
      break;
    case "6":
      resultObj = { text: "暂停", color: "#ff0000" }
      break;
  }
  return resultObj
}

//开始下载
const onStartDownload = (row) => {
  if (row.url) {
    try {
      new URL(row.url)
      row.state = "2"
      sendMessage("startDownload", proxyToObj(row))
    } catch (e) {
      notify("资源链接格式错误", "warning")
    }
  }
}

//提交批量链接
const onSubmitLink = () => {
  if (linkValue.value) {
    const arr = linkValue.value.replaceAll("；", ";").split(";").filter(item => item).map(item => item.trim())
    arr.forEach(item => {
      urlList.value.push(getDefaultRow(item))
    })
  }
}

//暂停下载
const pauseDownload = (row) => {
  sendMessage("pauseDownload", proxyToObj(row))
}

//继续下载
const resumeDownload = (row) => {
  let resumeRow = proxyToObj(row)
  sendMessage("resumeDownload", resumeRow)
}

//取消下载
const cancelDownload = (row) => {
  $q.dialog({
    title: $t("cancel"),
    message: $t("Confirm cancel the download?"),
    ok: $t("confirm"),
    cancel: $t("cancel"),
    persistent: true
  }).onOk(() => {
    sendMessage("cancelDownload", proxyToObj(row))
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })

}

//删除
const deleteDownload = (row, index) => {
  $q.dialog({
    title: $t("cancel"),
    message: $t("Confirm delete the download?"),
    ok: $t("confirm"),
    cancel: $t("cancel"),
    persistent: true
  }).onOk(() => {
    if (row.state === "1") {
      urlList.value.splice(index, 1)
    } else {
      if (isDeleteFile.value) {
        sendMessage("deleteDownload", { ...proxyToObj(row), isDeleteFile: isDeleteFile.value })
      } else {
        urlList.value.splice(index, 1)
      }
    }
    saveUrlDownloads()
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}


//添加一个
const addRow = () => {
  urlList.value.push(getDefaultRow())
  saveUrlDownloads()
}

//打开文件夹
const openDownloadFolder = (row) => {
  openDownloadPath()
}

//保存下载的列表
const saveUrlDownloads = () => {
  sendMessage("saveDownloads", JSON.stringify(urlList.value))
}

//更新行
onReceiveMessage("updateDownloadRow", (data) => {
  console.log("daad", data);
  if (data.isDelete) {
    urlList.value = urlList.value.filter(item => item.id != data.id)
  } else {
    urlList.value.some(item => {
      if (item.id == data.id) {
        Object.assign(item, data)
        return true
      }
    })
  }
  saveUrlDownloads()
})

//https://nodejs.org/dist/v20.14.0/node-v20.14.0-x64.msi
const getDefaultRow = (url, isTorrent) => {
  return {
    id: getNewID(), url: url ? url : "https://www.yunren.online/example.txt", progress: 0, state: "1", localPath: "",
    isTorrent: isTorrent ? true : false
  }
}

const urlList = ref([])

onMounted(() => {
  let downloads = getDownloadsFile()
  if (downloads) {
    urlList.value = JSON.parse(downloads)
  } else {
    urlList.value = [getDefaultRow()]
  }
})

</script>

<style lang="scss" scoped>
.package-page {
  padding: 10px;
  .page-title {
    display: flex;
    align-items: center;
  }
  .download-head {
    margin-bottom: 10px;
  }
}
</style>