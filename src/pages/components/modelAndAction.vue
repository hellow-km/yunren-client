<template>
  <div class="model-page">
    <div class="model-panel">
      <h5>{{$t("模型管理")}}
        <miButton
          class="import-btn"
          :label="$t('导入')"
          @click="importModel"
        ></miButton>
      </h5>
      <div class="model-box">
        <div
          v-for="item in models"
          @click="changeSelect(item,'1')"
          :key="item"
          class="model-box-item"
          :style="{
            background:`url(${item.backImage||localImages.renou}) no-repeat top center`,
            backgroundSize:'80%'
          }"
        >
          <div
            class="model-item-name"
            :title="item.name"
          >{{item.name}}</div>
          <span
            class="model-item-checked"
            v-if="item.isUsed"
          >
            <img
              width="20"
              :src="localImages.gougou"
              alt=""
            >
          </span>
        </div>
      </div>
    </div>
    <div class="model-panel">
      <h5>{{$t("动作管理")}}
        <miButton
          class="import-btn"
          :label="$t('导入')"
          @click="importAction"
        ></miButton>
      </h5>
      <div class="model-box">
        <div
          v-for="item in actions"
          @click="changeSelect(item,'2')"
          :key="item"
          class="model-box-item"
          :style="{
            background:`url(${item.backImage||localImages.action}) no-repeat center 15px`,
            backgroundSize:'60%',
          }"
        >
          <div
            class="model-item-name"
            :title="item.name"
          >{{item.name}}</div>
          <span
            class="model-item-checked"
            v-if="item.isUsed"
          >
            <img
              width="20"
              :src="localImages.gougou"
              alt=""
            >
          </span>
        </div>
      </div>
    </div>
    <div class="model-footer">
      <!-- <miButton
        @click="saveModelActions"
        label="保存"
      ></miButton> -->
      <span>
        <miButton
          @click="openManagerFolder"
          :label="$t('打开管理文件夹')"
        ></miButton>
        <q-tooltip>{{$t("modelTip")}}</q-tooltip>
      </span>
    </div>
  </div>
</template>

<script setup>
import { localImages } from "src/utils/images"
import miButton from "src/components/form/mi-button.vue"
import { ref } from "vue"
import { notify, openFileDialog } from "src/utils"
import { formatTime } from "src/utils/index"

const { mainPath, fs, path, createFolder, getFilepathIdentify, readFileSync, openPath } = window.api

const modelListFile = path.join(mainPath, "model")
const actionsListFile = path.join(mainPath, "actions")

const models = ref([])
const actions = ref([])


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

const importModel = () => {
  openFileDialog(true, 1024 * 1024 * 1024, ".PMD,.PMX").then(files => {
    files.forEach(file => {
      const idenfy = getFilepathIdentify(file.path)
      if (idenfy.extNoDot.toLocaleLowerCase() == "pmd" || idenfy.extNoDot.toLocaleLowerCase() == "pmx") {
        pushModel(file.path)
      } else {
        notify("格式不支持", "warning")
      }
    })
  })
}

const changeSelect = (item, type) => {
  if (type == "1") {
    models.value.some(item => {
      item.isUsed = false
    })
    item.isUsed = true
    saveModels()
  } else if (type == "2") {
    item.isUsed = !item.isUsed
    if (actions.value.filter(item => item.isUsed).length > 5) {
      if (item.isUsed) {
        item.isUsed = false
      }
    }
    saveActions()
  }
}

const openManagerFolder = () => {
  openPath(path.join(mainPath, "public"))
}

//写入模型数据
const pushModel = (filePath) => {
  const idenfy = getFilepathIdentify(filePath)
  const fName = idenfy.fileNameNoExt + formatTime(new Date(), "mmss")
  const folder = path.join(mainPath, `public/models/${fName}`)
  createFolder(folder)
  fs.copyFileSync(filePath, path.join(folder, idenfy.fileName))
  models.value.push({
    isUsed: false,
    path: `http://localhost:15287/models/${fName}`,
    name: idenfy.fileNameNoExt,
    localPath: path.join(folder, idenfy.fileName),
    backImage: ""
  })
  saveModels()
}

//写入动作数据
const pushAction = (filePath) => {
  const idenfy = getFilepathIdentify(filePath)
  const folder = path.join(mainPath, `public/motions`)
  if (fs.existsSync(path.join(folder, idenfy.fileName))) {
    notify("动作已存在", "warning")
    return
  }
  fs.copyFileSync(filePath, path.join(folder, idenfy.fileName))
  actions.value.push({
    isUsed: false,
    path: `http://localhost:15287/motions/${idenfy.fileName}`,
    localPath: path.join(folder, idenfy.fileName),
    name: idenfy.fileNameNoExt,
    backImage: ""
  })
  saveActions()
}

//导入动作
const importAction = () => {
  openFileDialog(true, 1024 * 1024 * 1024, ".vmd").then(files => {
    files.forEach(file => {
      const idenfy = getFilepathIdentify(file.path)
      if (idenfy.extNoDot.toLocaleLowerCase() == "vmd") {
        pushAction(file.path)
      } else {
        notify("格式不支持", "warning")
      }
    })
  })
}

const defaultModelData = [formatModelData("models/蓬莱人形/上海人形_ver1.00.pmx", true, "1")]

const defaultActionsData = fs.readdirSync(path.join(mainPath, "public/motions")).filter(item => {
  const idenfy = getFilepathIdentify(item)
  return idenfy.extNoDot.toLocaleLowerCase() == "vmd"
}).map((item, index) => formatModelData("motions/" + item, index < 5, "2"))



//初始化获取数据
const init = () => {
  if (fs.existsSync(modelListFile)) {
    const d = readFileSync(modelListFile).toString()
    models.value = JSON.parse(d)
  } else {
    fs.writeFileSync(modelListFile, JSON.stringify(defaultModelData))
    models.value = defaultModelData
  }
  if (fs.existsSync(actionsListFile)) {
    const d = JSON.parse(readFileSync(actionsListFile).toString())
    defaultActionsData.forEach(item => {
      if (!d.some(_item => _item.localPath === item.localPath)) {
        item.isUsed = false
        d.push(item)
      }
    })

    actions.value = d
  } else {
    fs.writeFileSync(actionsListFile, JSON.stringify(defaultActionsData))
    actions.value = defaultActionsData
  }
  models.value = models.value.filter(item => fs.existsSync(item.localPath))
  actions.value = actions.value.filter(item => fs.existsSync(item.localPath))
}

//保存模型
const saveModels = () => {
  fs.writeFileSync(modelListFile, JSON.stringify(models.value))
}

//保存动作
const saveActions = () => {
  fs.writeFileSync(actionsListFile, JSON.stringify(actions.value))
}

init()
</script>

<style lang="scss" scoped>
.model-page {
  h5 {
    margin: 25px 0;
  }
  padding: 10px;
  padding-bottom: 50px;
  .model-panel {
    position: relative;

    .import-btn {
      margin-left: 20px;
    }
    .model-box {
      overflow: auto;
      max-height: 180px;
      display: flex;
      flex-wrap: wrap;
      .model-box-item {
        margin-top: 10px;
        cursor: pointer;
        flex-wrap: wrap;
        margin-left: 10px;
        width: 120px;
        height: 120px;
        border: 1px solid #aaa;
        border-radius: 6px;
        position: relative;
        &:hover {
          background-color: aquamarine;
        }
        .model-item-name {
          position: absolute;
          bottom: 0;
          left: 5px;
          right: 5px;
          text-align: center;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .model-item-checked {
          position: absolute;
          top: 5px;
          right: 5px;
          img {
            background-color: #fff;
          }
        }
      }
    }
  }
  .model-footer {
    position: absolute;
    bottom: 15px;
    left: 0;
    right: 0;
    text-align: center;
  }
}
</style>