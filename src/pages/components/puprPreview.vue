<template>
  <div class="pupr-panel">
    <div class="pupr-footer">
      <span>
        <miButton
          :label="$t('save')"
          @click="saveImage"
        ></miButton>
        <q-tooltip>{{$t("Save will without border")}}</q-tooltip>
      </span>
    </div>
    <div class="pupr-scroll">
      <div
        class="pupr-page"
        ref="puprPage"
        :style="{width:paperWidth+'px'}"
      >
        <img
          class="puprPage-item"
          :style="{
          left:item.left+'px',
          top:item.top+'px'
        }"
          v-for="(item,index) in newData"
          :src="item.src"
          :key="index"
          alt=""
          :width="item.newW"
          :height="item.newH"
        >
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted, ref } from "vue"
import miButton from "src/components/form/mi-button.vue"
import { notify, saveBase64Image } from "src/utils"
import { useUserStore } from "src/stores/user"
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  colSplit: {
    type: Number,
    default: 5
  },
  rowSplit: {
    type: Number,
    default: 5
  },
  col: {
    type: Number,
    default: 3
  },
  paperWidth: {
    type: Number,
    default: 1000
  }
})

const user = useUserStore()

const puprPage = ref(null)

const newData = ref([])

const canvasH = ref(0)

const init = () => {
  canvasH.value = 0
  const container = puprPage.value;

  newData.value = props.data.reduce((prev, cur) => {
    const pushVal = cur.map(item => {
      item.newW = item.isOrgin ? item.orginW : item.width
      item.newH = item.isOrgin ? item.orginH : item.height
      return item
    }).filter(item => item.src && item.newW <= props.paperWidth - props.colSplit)
    prev.push(...pushVal)
    return prev
  }, [])

  newData.value.sort((a, b) => {
    return b.newW - a.newW;
  })

  const heightPoints = new Array(props.paperWidth).fill(0)
  const colSplit = Number(props.colSplit)
  const rowSplit = Number(props.rowSplit)
  console.log("colSplit", colSplit, rowSplit);
  const pushTopLeft = (dataItem) => {
    let left = null;
    let top = null;
    const itemWidth = Number(dataItem.newW) + colSplit;
    const itemHeight = Number(dataItem.newH) + rowSplit;
    // Loop through possible top-left positions
    for (let y = 0; ; y++) {
      if (y > 39999) {
        break
      }
      for (let x = 0; x <= props.paperWidth - itemWidth; x++) {
        let fits = true;

        // Check if the item fits in the current position
        for (let dx = 0; dx < itemWidth; dx++) {
          // Ensure heightPoints array is long enough
          if (heightPoints[x + dx] === undefined) {
            heightPoints[x + dx] = 0;
          }

          if (heightPoints[x + dx] > y) {
            fits = false;
            break;
          }
        }

        if (fits) {
          left = x;
          top = y;
          break;
        }
      }

      if (left !== null && top !== null) {
        break;
      }
    }

    if (left !== null && top !== null) {
      dataItem.left = left;
      dataItem.top = top;

      // Update the height points
      for (let dx = 0; dx < itemWidth; dx++) {
        if (canvasH.value < top + itemHeight) {
          canvasH.value = top + Number(itemHeight)
        }
        heightPoints[left + dx] = top + itemHeight;
      }

    } else {
      console.error("Cannot place item:", dataItem);
    }
  }

  for (let i = 0; i < newData.value.length; i++) {
    const dataItem = newData.value[i];
    pushTopLeft(dataItem)
  }

  console.dir(container)
}

//保存
const saveImage = () => {
  console.log("canvasH.value", canvasH.value);
  const canvas = document.createElement("canvas")
  canvas.width = props.paperWidth
  canvas.height = canvasH.value
  const ctx = canvas.getContext("2d")
  let idx = 0
  const drawItem = (item, i) => {
    const img = new Image(item.width, item.height)
    img.src = item.src
    img.onload = function () {
      idx++
      ctx.drawImage(img, item.left, item.top, item.newW, item.newH)
      if (idx >= newData.value.length) {
        // if (!user.isLogin) {
        //   notify($t("loginRmMark"))
        //   var backgroundColor = "rgba(0, 0, 0, 0.5)"; // 半透明黑色
        //   var textColor = "white";
        //   ctx.fillStyle = backgroundColor
        //   ctx.fillRect(canvas.width - 120, canvas.height - 35, 100, 25);
        //   ctx.fillStyle = textColor;
        //   ctx.fillText("yunren.online", canvas.width - 100, canvas.height - 20)
        // }
        let base64 = canvas.toDataURL("image/png")
        saveBase64Image(base64)
      }
    }
    img.onerror = function () {
      idx++
    }
  }
  newData.value.forEach((item, i) => {
    if (item.src && item.newW && item.newH && (item.left || item.left === 0) && (item.top || item.top === 0)) {
      drawItem(item, i)
    } else {
      idx++
    }
  })
}

const getItemWH = (item) => {
  const w = item.isOrgin ? item.orginW : item.width
  const h = item.isOrgin ? item.orginH : item.height
  return { w, h }
}

onMounted(() => {
  init()
})

</script>

<style lang="scss" scoped>
.pupr-scroll {
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
}
.pupr-page {
  margin: 0 auto;
  border-right: 1px solid #aaa;
  border-left: 1px solid #aaa;
  width: 100%;
  height: 100%;
  position: relative;
  .puprPage-item {
    transition: all 0.3s;
    position: absolute;
    border: 1px solid #aaa;
  }
}
.pupr-panel {
  width: 100%;
  height: 97%;
  position: relative;
  .pupr-footer {
    text-align: center;
    margin: 10px 0;
  }
}
</style>