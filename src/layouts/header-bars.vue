<template>
  <div class="header-bar">
    <div
      class="header-list"
      v-if="isShowMenu"
    >
      <div
        class="header-list-item"
        ref="listItem"
        @mouseover="onItemHover($event,index)"
        @mouseleave="onItemLeave($event,index)"
        @click="toPath(item.path,index)"
        v-for="(item,index) in headerList"
        :key="item.title"
      >
        <div class="header-list-item-title">{{$t(item.title)}}</div>
        <a :href="item.path"></a>
      </div>
      <div
        ref="activeLine"
        class="active-bar"
      ></div>
    </div>

    <div v-else>
      <q-btn
        color="primary"
        :label="$t('menu')"
      >
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item
              clickable
              v-close-popup
              v-for="item in headerList"
              :key="item.path"
              @click="toPath(item.path,index)"
            >
              <q-item-section>{{$t(item.title)}}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { isLessWidth } from "src/utils";

const router = useRouter()
const route = useRoute()



const headerList = ref([
  {
    title: "home",
    path: "/"
  },
  {
    title: "onlineTools",
    path: "/onlineTools"
  },
  {
    title: "articles",
    path: "/articles"
  },

  {
    title: "download",
    path: "/download"
  },
  // {
  //   title: "小游戏",
  //   path: "/games"
  // },

  {
    title: "feetback",
    path: "/feetback"
  },
])

const activeLine = ref(null)

const activeI = ref(0)

const listItem = ref(null)

const toPath = (path, i) => {
  activeI.value = i
  router.push(path)
}

const isShowMenu = ref(!isLessWidth())

//移动下面标记
const barLineMove = (moveI = activeI.value) => {
  let moveItem = listItem.value[moveI]
  Object.assign(activeLine.value.style, {
    left: moveItem.offsetLeft + "px",
    top: moveItem.offsetTop + moveItem.offsetHeight + 5 + "px",
    width: moveItem.offsetWidth + "px"
  })
}
// 暴露出去
defineExpose({
  barLineMove
})
//鼠标移开事件
const onItemLeave = (e, i) => {
  barLineMove()
}

//鼠标hover事件
const onItemHover = (e, i) => {
  barLineMove(i)
}

const emit = defineEmits(["update:modelValue", "onchange"]);

watch(() => route.name, (nv) => {
  if (isShowMenu.value) {
    headerList.value.some((item, index) => {
      if (location.hash.replace("#", "") == item.path) {
        activeI.value = index
        return true
      }
    })
    barLineMove()
  }
}, { deep: true })

onMounted(() => {
  if (isShowMenu.value) {
    headerList.value.some((item, index) => {
      if (location.hash.replace("#", "") == item.path) {
        activeI.value = index
        return true
      }
    })
    barLineMove()
  }

  window.addEventListener("resize", () => {
    isShowMenu.value = !isLessWidth()
  })
})
</script>

<style lang="scss" scoped>
.header-bar {
  display: flex;
  margin: 0 auto;
  position: relative;
  .header-list {
    display: flex;
    margin: 0 auto;
    position: relative;
    .header-list-item {
      margin-right: 15px;
      cursor: pointer;

      .header-list-item-title {
        padding: 5px 10px;
        position: relative;
        &::before {
          content: "";
          position: absolute;
          border-radius: 4px;
          z-index: -1;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          transform: scaleY(0);
          transform-origin: 50% 100%;
          transition: transform 0.3s ease-out;
        }
      }

      transition: all 0.2s;
      &:hover {
        color: #fff;
        .header-list-item-title::before {
          background-color: #4285f4;
          transform: scaleY(1);
        }
      }
    }
  }

  .active-bar {
    position: absolute;
    transition: all 0.3s;
    height: 3px;
    background-color: #4285f4;
  }
}
</style>
