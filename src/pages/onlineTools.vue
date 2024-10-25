<template>
  <div class="content-list">
    <div class="menu-option">
      <div
        class="menu-option-item"
        style="margin-right:auto"
      >
        <searchIpt
          v-model="searchValue"
          @onSearch="onSearchMenu"
        ></searchIpt>
      </div>
      <div class="menu-option-item">
        <span>{{$t("barScale")}}</span>
        <q-slider
          class="item-slider"
          v-model="scale"
          :min="50"
          :max="150"
          @change="sliderChange"
        />
        <span style="width:50px;">{{scale}}%</span>
      </div>
    </div>
    <div
      v-for="item in menuList"
      :key="item.title"
    >
      <div class="menu-title">{{$t(item.title)}}</div>
      <div class="content-menu">
        <contentItembar
          :style="{width:boxItemWidth,zoom:scale+'%'}"
          class="content-list-item"
          @click="clickItem(item)"
          v-for="item in item.list"
          :key="item.label"
          :label="$t(item.label)"
          :img="item.img"
        ><a :href="item.path"></a></contentItembar>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import miButton from "src/components/form/mi-button.vue"
import loginPage from "src/components/login.vue"
import miDialog from "src/components/mi-dialog.vue"
import { useRoute, useRouter } from "vue-router"
import { useUserStore } from 'src/stores/user'
import contentItembar from "src/components/contentItembar.vue"
import searchIpt from "src/components/searchIpt.vue"
import { isLessWidth } from 'src/utils'
import { toolsImg } from 'src/utils/images'
import { imageMerge, xlsText } from 'src/utils/string'
const router = useRouter()
const scale = ref(100)

const menuList = ref([
  {
    title: "pictureTool",
    list: [
      {
        label: "translations.SpriteMake",
        path: "/SpriteMake",
        img: toolsImg.SpriteMake
      },
      {
        label: "imageMerge",
        path: "/imageMerge",
        img: toolsImg.imageMerge
      },
      {
        label: "translations.imageCompressTitle",
        path: "/imgCompress",
        img: toolsImg.imgCompress
      },
      {
        label: "translations.imageConvertTitle",
        path: "/imgConverter",
        img: toolsImg.imgConvert
      },
      {
        label: "translations.pictureInfoTitle",
        path: "/pictureInfo",
        img: toolsImg.imgInfo
      },
      {
        label: "translations.textToImage",
        path: "/textToImage",
        img: toolsImg.textImage
      },
      {
        label: "translations.qrRegion",
        path: "/qrRegion",
        img: toolsImg.qrRegion
      },
      {
        label: "translations.qrCreate",
        path: "/qrCreate",
        img: toolsImg.qrCreate
      },

    ]
  },
  {
    title: "queryTool",
    list: [
      {
        label: "translations.ipQueryTitle",
        path: "/IPSelect",
        img: toolsImg.imgIP
      }
    ]
  },
  {
    title: "editTool",
    list: [
      {
        label: "xlsText",
        path: "/xlsEdit",
        img: toolsImg.XLS
      }
    ]
  },
  {
    title: "codeTool",
    list: [
      {
        label: "translations.jsCompressTitle",
        path: "/jsCompress",
        img: toolsImg.JSCompress
      },
      {
        label: "translations.cssCompressTitle",
        path: "/cssCompress",
        img: toolsImg.CSSCompress
      },
      {
        label: "translations.jsonCompressTitle",
        path: "/jsonCompress",
        img: toolsImg.JSONCompress
      },
      {
        label: "translations.jsEncryptTitle",
        path: "/jsObfuscator",
        img: toolsImg.JSSecret
      },
      {
        label: "translations.htmlToXMLTitle",
        path: "/htmlToXML",
        img: toolsImg.htmlXml
      },
    ]
  },

])

const searchValue = ref("")

const defaultMenu = JSON.parse(JSON.stringify(menuList.value))

const onSearchMenu = () => {
  if (searchValue.value) {
    menuList.value = defaultMenu.map(item => {
      return {
        title: item.title,
        list: item.list.filter(_item => {
          return _item.label.toLocaleLowerCase().indexOf(searchValue.value.toLocaleLowerCase()) > -1
        })
      }
    })
  } else {
    menuList.value = defaultMenu
  }
}



const clickItem = (item) => {
  router.push(item.path)
  gtag("event", "click", {
    event_category: item.path,
    event_label: "工具",
    value: 1,
  });
}

const sliderChange = () => {
  localStorage.setItem("toolScale", scale.value)
}

const boxItemWidth = ref(isLessWidth() ? "80%" : "")

onMounted(() => {
  window.addEventListener("resize", () => {
    boxItemWidth.value = isLessWidth() ? "80%" : ""
  })
  let toolScale = localStorage.getItem("toolScale")
  if (toolScale) {
    scale.value = Number(toolScale)
  }
})
</script>

<style lang="scss" scoped>
.content-list {
  width: 90%;
  margin: 0 auto;
  .menu-option {
    display: flex;
    font-size: 16px;
    margin: 15px 0;
    flex-wrap: wrap;
    .menu-option-item {
      display: flex;
      white-space: nowrap;
      align-items: center;
      .item-slider {
        display: inline-block;
        width: 200px;
        max-width: 200px;
        min-width: 200px;
        margin: 0 5px;
      }
    }
  }
  .content-menu {
    display: flex;
    flex-wrap: wrap;
  }
  .menu-title {
    font-size: 30px;
  }
}
</style>
