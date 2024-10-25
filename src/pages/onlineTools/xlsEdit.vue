<template>

  <div class="office-preview-page">
    <div class="preview-upload">
      <miUpload
        @getFiles="getFiles"
        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :isMulti="false"
        :maxSize="300*1024*1024"
      ></miUpload>
    </div>
    <div style="margin:10px 0">{{$t("intro.excel")}}</div>
    <div class="head-options">
      <miButton
        v-if="!workbook"
        :label="$t('addWorkbook')"
        @click="addworkbook"
      ></miButton>
      <miButton
        :label="$t('addWorksheet')"
        v-if="workbook"
        @click="addworksheet"
        color="primary"
      ></miButton>
      <miInput
        input-class="color-ipt"
        class="sheetName-ipt options-back-ipt"
        v-if="workbook&&(curI||curI===0)"
        v-model="workbook.SheetNames[curI]"
      ></miInput>
      <miButton
        v-show="workbook"
        class="save-btn"
        @click="saveExcel"
        :label="$t('save')"
      ></miButton>
    </div>
    <div
      class="content-page"
      v-if="workbook"
    >
      <miButton
        :label="$t('addColumn')"
        @click="addCol"
        color="secondary"
      ></miButton>
      <miButton
        style="margin-left:15px"
        :label="$t('addRow')"
        color="secondary"
        @click="addRow"
      ></miButton>
      <selectbar
        :list="workbook.SheetNames.map(item=>{
          return {
            title:item,
            path:item
          }
        })"
        :canMouseWheel="false"
        v-model="sheetName"
        @change="onChange"
      ></selectbar>

      <div id="excel-page"></div>
    </div>
  </div>

</template>

<script setup>
import miUpload from "src/components/form/mi-upload.vue"
import miButton from "src/components/form/mi-button.vue"
import selectbar from "src/components/select-bar.vue"
import miInput from "src/components/form/mi-input.vue"
import { nextTick, ref } from "vue";
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import * as XLSXO from 'xlsx';
import XLSX from 'xlsx-js-style';

const file = ref(null)

const previewUrl = ref("")

const sheetName = ref("")

const hots = ref([])

const workbook = ref(null)

const curI = ref(0)

//增加行
const addCol = () => {
  let hot = hots.value[curI.value]
  hot.alter('insert_col_end')
  let wtHolder = document.getElementsByClassName("wtHolder")[0]
  scrollToRight(wtHolder)
}

//新增工作簿
const addworkbook = () => {
  workbook.value = XLSX.utils.book_new();
  const defaultName = "sheet"
  const newWorksheet = XLSX.utils.aoa_to_sheet([["", "", ""], ["", "", ""], ["", "", ""]]);
  XLSX.utils.book_append_sheet(workbook.value, newWorksheet, defaultName);
  fillHotData()
  nextTick(() => {
    loadSheet(workbook.value.SheetNames[0])
  })
}

const addworksheet = () => {
  try {
    const allSheetKey = Object.keys(workbook.value.Sheets)
    let defaultName = "sheet" + allSheetKey.length
    if (allSheetKey.includes(defaultName)) {
      defaultName += "_new"
    }
    const newWorksheet = XLSX.utils.aoa_to_sheet([["", "", ""], ["", "", ""], ["", "", ""]]);
    XLSX.utils.book_append_sheet(workbook.value, newWorksheet, defaultName);
    fillHotData()
  } catch (e) { }
}

const scrollToRight = (el) => {
  // page-main
  el.scrollLeft = 9999
}

const scrollToBottom = (el) => {
  // page-main
  el.scrollTop = 9999
}

//增加列
const addRow = () => {
  let hot = hots.value[curI.value]
  hot.alter('insert_row_below')
  // let pageMain = document.getElementsByClassName("page-main")[0]
  // scrollToBottom(pageMain)
  let wtHolder = document.getElementsByClassName("wtHolder")[0]
  scrollToBottom(wtHolder)
}

//读取文件
const getFiles = (files) => {
  hots.value = []
  workbook.value = null
  let file = files[0]
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    workbook.value = XLSX.read(data, { type: 'array' });

    fillHotData()
    nextTick(() => {
      loadSheet(workbook.value.SheetNames[0])
    })

  };

  reader.readAsArrayBuffer(file);
}

const onChange = (item) => {
  loadSheet(item.path)
}

//获取所有sheet
const fillHotData = () => {
  hots.value = []
  const colWidths = []
  workbook.value.SheetNames.forEach(sheetName => {
    const worksheet = workbook.value.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    let maxLen = 0
    jsonData.forEach(item => {
      if (maxLen < item.length) {
        maxLen = item.length
      }
    })
    jsonData.map(item => {
      for (let i = 0; i < maxLen; i++) {
        if (!item[i]) {
          item[i] = ""
        }
      }
    })
    const container = document.createElement("div")

    hots.value.push(new Handsontable(container, {
      data: jsonData,
      rowHeaders: true,
      colHeaders: true,
      manualRowMove: true, // 启用手动调整行的顺序
      manualColumnMove: true, // 启用手动调整列的顺序
      licenseKey: 'non-commercial-and-evaluation',
    }));

  })
}

//加载sheet
const loadSheet = (sheetName) => {
  curI.value = workbook.value.SheetNames.findIndex(item => {
    return item == sheetName
  })

  const worksheet = workbook.value.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  let maxLen = 0
  jsonData.forEach(item => {
    if (maxLen < item.length) {
      maxLen = item.length
    }
  })
  jsonData.map(item => {
    for (let i = 0; i < maxLen; i++) {
      if (!item[i]) {
        item[i] = ""
      }
    }
  })
  const container = document.getElementById('excel-page');
  if (container) {
    container.innerHTML = ""
  }
  const rootElement = hots.value[curI.value].rootElement
  container.appendChild(rootElement)
  const ht_clone_top = rootElement.getElementsByClassName("ht_clone_top")[0]
  const ht_clone_left = rootElement.getElementsByClassName("ht_clone_left")[0]

  const wtHolder = rootElement.getElementsByClassName("wtHolder")[0]

  const wtHider = ht_clone_top.getElementsByClassName("wtHider")[0]

  const wtHiderLeft = ht_clone_left.getElementsByClassName("wtHider")[0]
  wtHolder.addEventListener("scroll", () => {
    wtHider.style.transition = "all 0.3s"
    wtHider.style.transform = `translateX(-${wtHolder.scrollLeft}px)`
    wtHiderLeft.style.transition = "all 0.3s"
    wtHiderLeft.style.transform = `translateY(-${wtHolder.scrollTop}px)`
  })
}

//保存excel
const saveExcel = () => {
  const newWorkbook = XLSX.utils.book_new();
  for (let index = 0; index < hots.value.length; index++) {
    const hot = hots.value[index];

    const exportData = hot.getData();
    const newWorksheet = XLSX.utils.aoa_to_sheet(exportData);
    // console.log("hot", newWorksheet, hot, hot.getCell(), hot.getColWidth(), hot.getRowHeight());
    let colWdiths = [], rowHeights = []
    for (let i = 0; i < exportData.length; i++) {
      colWdiths.push({ wpx: hot.getColWidth(i) })
    }
    for (let i = 0; i < exportData[0].length; i++) {
      rowHeights.push({ hpx: hot.getRowHeight(i) })
    }
    newWorksheet['!cols'] = colWdiths
    // newWorksheet['!rows'] = rowHeights

    // 设置单元格自动换行
    const range = XLSX.utils.decode_range(newWorksheet['!ref']);
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!newWorksheet[cellAddress]) continue;
        if (!newWorksheet[cellAddress].s) newWorksheet[cellAddress].s = {};
        newWorksheet[cellAddress].s.alignment = { wrapText: true };
      }
    }
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, workbook.value.SheetNames[index]);
  }
  XLSX.writeFile(newWorkbook, 'edited.xlsx');
}

</script>

<style lang="scss" scoped>
.office-preview-page {
  padding: 10px;
  width: 100%;
  height: 100%;
  .preview-upload {
    margin-top: 25px;
    display: flex;
    justify-content: center;
  }
  #excel-page {
  }
  .head-options {
    display: flex;
    .save-btn {
      margin-left: auto;
      margin-right: 25px;
    }
    .sheetName-ipt {
      display: inline-block;
      width: 210px;
      margin-left: 20px;
    }
  }

  ::v-deep .content-page {
    margin-top: 15px;
    .wtHolder {
      width: 100% !important;
    }
    .content-footer {
      text-align: center;
      margin-top: 10px;
    }
  }
}
</style>