<template>
  <div
    style="overflow:hidden"
    @mousedown="onBarMousedown"
    @mousemove="onBarMousemove"
    @mouseup="onBarMouseup"
    @mousewheel="onBarMousewheel"
    :style="{
      width:moveObj.barWidth+'px'
    }"
  >
    <div
      class="header-bar"
      :style="{
 
      }"
    >
      <div
        class="header-list"
        :style="{
          width:moveObj.boxWidth+'px',
          transform:`translateX(${moveObj.x}px)`
        }"
      >
        <div
          class="header-list-item"
          ref="listItem"
          :style="{
            cursor:moveObj.cursor
          }"
          @mouseover="onItemHover($event,index)"
          @mouseleave="onItemLeave($event,index)"
          @mouseup="toPath(item)"
          v-for="(item,index) in list"
          :key="item.title"
        >
          {{item.title}}
        </div>
        <div
          ref="activeLine"
          class="active-bar"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defaultPageWidth } from "src/utils";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter()
const route = useRoute()

const minBarWidth = ref(80)

const emit = defineEmits(["change", "update:modelValue"])

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: String,
    default: ""
  },
  canMouseWheel: {
    type: Boolean,
    default: true
  }
})


const moveObj = ref({
  barWidth: window.innerWidth,
  boxWidth: 0,
  isDown: false,
  downX: 0,
  x: 0,
  downX: 0,
  pL: 50,
  pR: 50,
  minX: 0,
  maxX: 0,
  moreX: 200,
  isMore: false,
  isClick: false,
  downClientX: 0,
  cursor: "pointer"
})

const activeLine = ref(null)

const activeI = ref(0)

const listItem = ref(null)

const toPath = (item) => {
  if (moveObj.value.isClick) {
    emit("update:modelValue", item.path)
    emit("change", item)
  }
}

const onBarMousewheel = (e) => {
  if (!props.canMouseWheel) return
  e.stopPropagation()
  e.preventDefault()
  const { x, maxX, minX, downX, isMore, moreX } = moveObj.value
  const n = e.deltaY > 0 ? -300 : 300
  if (x + n > maxX) {
    moveTo(x, maxX)
  } else if (x + n < minX) {
    moveTo(x, minX)
  } else {
    moveTo(x, x + n)
  }
}

//移动下面标记
const barLineMove = (moveI = activeI.value) => {
  let moveItem = listItem.value[moveI]
  setTimeout(() => {
    Object.assign(activeLine.value.style, {
      left: moveItem.offsetLeft + 10 + "px",
      top: moveItem.offsetTop + moveItem.offsetHeight + 5 + "px",
      width: (moveItem.offsetWidth < minBarWidth.value ? minBarWidth.value : moveItem.offsetWidth) - 20 + "px"
    })
  }, 100);

}

//鼠标移开事件
const onItemLeave = (e, i) => {
  barLineMove()
}

//鼠标hover事件
const onItemHover = (e, i) => {
  barLineMove(i)
}

watch(() => props.modelValue, (nv) => {
  props.list.some((item, index) => {
    if (props.modelValue == item.path) {
      activeI.value = index
      return true
    }
  })
  barLineMove()
}, { deep: true })

const getBoxWidth = () => {
  let w = 0
  const listItems = listItem.value
  for (let i = 0; i < listItems.length; i++) {
    const element = listItems[i];
    w += element.offsetWidth
  }
  return w
}

//鼠标按下
const onBarMousedown = (e) => {
  moveObj.value.isDown = true
  moveObj.value.cursor = "pointer"
  moveObj.value.isClick = true
  moveObj.value.downClientX = e.clientX
  moveObj.value.downX = e.clientX - moveObj.value.x
  window.addEventListener("mousemove", onBarMousemove)
  window.addEventListener("mouseup", onBarMouseup)

}
//鼠标移动
const onBarMousemove = (e) => {
  if (moveObj.value.isDown) {
    const x = e.clientX
    const disX = x - moveObj.value.downX
    const { minX, maxX, pL, pR, downX, downClientX } = moveObj.value
    if (disX >= minX - pL && disX <= maxX + pR) {
      moveObj.value.isMore = e.clientX > downClientX ? true : false;
      moveObj.value.x = disX
      if (Math.abs(e.clientX - downClientX) > 20) {
        moveObj.value.isClick = false
        moveObj.value.cursor = "grab"
      }
    }
  }
}

//鼠标放开
const onBarMouseup = (e) => {
  window.removeEventListener("mousemove", onBarMousemove)
  window.removeEventListener("mouseup", onBarMouseup)
  moveObj.value.isDown = false
  moveObj.value.cursor = "pointer"
  if (!moveObj.value.isClick) {
    const { x, maxX, minX, downX, isMore, moreX } = moveObj.value
    const n = isMore ? moreX : -moreX
    if (x + n > maxX) {
      moveTo(x, maxX)
    } else if (x + n < minX) {
      moveTo(x, minX)
    } else {
      moveTo(x, x + n)
    }
    if (x > maxX) {
      moveTo(x, maxX)
    }
    if (x < minX) {
      moveTo(x, minX)
    }
  }
}
//移动
const moveTo = (currentX, targetX, duration = 500) => {
  const startX = currentX;
  const distance = targetX - startX;
  const startTime = performance.now();

  function animate(time) {
    const elapsedTime = time - startTime;
    const progress = Math.min(elapsedTime / duration, 1); // Ensure progress does not exceed 1
    const easingProgress = easeOutCubic(progress);
    const newX = startX + (distance * easingProgress);

    // Update the position
    moveObj.value.x = newX;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

const easeOutCubic = (t) => {
  return 1 - Math.pow(1 - t, 3);
}


//初始化
const initBar = () => {
  moveObj.value.boxWidth = getBoxWidth()
  moveObj.value.barWidth = window.innerWidth > defaultPageWidth ? defaultPageWidth : window.innerWidth
  moveObj.value.maxX = 0
  let disW = moveObj.value.boxWidth - moveObj.value.barWidth
  if (disW > 0) {
    moveObj.value.minX = -disW
  } else {
    moveObj.value.minX = 0
  }
}

onMounted(() => {
  props.list.some((item, index) => {
    if (props.modelValue == item.path) {
      activeI.value = index
      return true
    }
  })
  barLineMove()
  initBar()
  window.addEventListener("resize", initBar)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", initBar)
})
</script>

<style lang="scss" scoped>
.header-bar {
  position: relative;
  padding-bottom: 8px;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  .header-list {
    display: flex;
    margin: 0 auto;
    position: relative;
    .header-list-item {
      padding: 0 40px;
      white-space: nowrap;
      .header-list-item-title {
        padding: 0 10px;
      }
      font-size: 14px;
      transition: all 0.2s;
      &:hover {
        font-size: 16px;
      }
    }
  }

  .active-bar {
    position: absolute;
    transition: all 0.2s;
    height: 3px;
    background-color: var(--q-info);
  }
}
</style>
