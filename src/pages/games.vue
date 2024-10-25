<template>
  <div class="games-page">
    <div>
      <div
        class="category-box"
        :style="{width:pageWidth}"
      >
        <miButton
          class="category-item"
          v-for="item in cateMenu"
          :key="item"
          @click="selectCategory(item)"
          :label="item"
          :flat="activeCate!=item"
        >
        </miButton>
      </div>
      <div
        class="games-box"
        :style="{width:pageWidth}"
      >
        <div
          class="games-box-item"
          :style="{
            width:boxItemWidth
          }"
          v-for="item in showGames"
          :key="item.name"
          @click="toHtml(item)"
        >
          <div class="item-img">
            <img
              :src="item.imgSrc"
              alt=""
            >
          </div>
          <div class="item-info">
            <div
              class="info-cm info-name"
              :style="{fontSize:nameFontSize}"
            >{{item.name}}</div>
            <div
              class="info-cm info-desc"
              :title="item.desc"
            >{{item.desc}}</div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import miButton from "src/components/form/mi-button.vue"
import gamesJSON from "./gamesJSON"
import { openGamesWindows } from "src/utils/games";
import { isLessWidth } from "src/utils";

defineOptions({
  name: 'games'
});

const activeCate = ref("全部")

const selectCategory = (item) => {
  activeCate.value = item
  if (item == "全部") {
    showGames.value = allGames.value
  } else {
    let findItem = gamesMenu.value.find(_item => _item.title == item)
    if (findItem) {
      showGames.value = findItem.list
    }
  }
}

const toHtml = (item) => {
  openGamesWindows(item.href, item.name)
}
//process.env.NODE_ENV === "development" ? "http://localhost:14423/4/index.html" :"http://49.235.158.186:12330/4/index.html"
const gamesMenu = ref(gamesJSON)

const allGames = ref(gamesMenu.value.reduce((prev, cur) => {
  prev.push(...cur.list.map(item => {
    return item
  }))
  return prev
}, []))

const showGames = ref(JSON.parse(JSON.stringify(allGames.value)))

const cateMenu = ref(gamesMenu.value.reduce((prev, cur) => {
  prev.push(cur.title)
  return prev
}, ["全部"]))

const pageWidth = ref(isLessWidth() ? "99vw" : "")

const nameFontSize = ref(isLessWidth() ? "18px" : "24px")

const boxItemWidth = ref(isLessWidth() ? "40%" : "30%")

onMounted(() => {
  window.addEventListener("resize", () => {
    boxItemWidth.value = isLessWidth() ? "40%" : "30%"
    nameFontSize.value = isLessWidth() ? "18px" : "24px"
    pageWidth.value = isLessWidth() ? "99vw" : ""
  })
})
</script>

<style lang="scss" scoped>
.games-page {
  display: flex;
  justify-content: center;
  .category-box {
    display: flex;
    flex-wrap: wrap;
    margin: 25px 0;
  }
  .games-box {
    display: flex;
    flex-wrap: wrap;
    // justify-content: center;
    .games-box-item {
      border: 1px solid #aaa;
      border-radius: 6px;
      padding: 5px;
      box-sizing: border-box;
      display: flex;
      cursor: pointer;
      margin: 10px;
      // &:nth-child(3n + 1) {
      //   margin-left: 0;
      // }
      .item-img {
        width: 100px;
        min-width: 60px;
        display: flex;
        align-items: center;
        img {
          width: 100%;
        }
      }
      .item-info {
        width: calc(100% - 80px);
        margin-left: 20px;

        .info-name {
          font-size: 20px;
        }
        .info-desc {
          white-space: nowrap;
          font-size: 12px;
          height: 50px;
          color: #aaa;
          margin-top: 5px;
          overflow: hidden; /* 隐藏溢出内容 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          &:hover {
            overflow: visible;
            height: auto;
          }
        }
      }
    }
  }
}
</style>
