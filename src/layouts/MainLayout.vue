<template>
  <div
    class="page-main"
    ref="pageMain"
    @scroll="onSetFooterShow"
  >
    <q-layout class="main-box">
      <q-header
        elevated
        class="page-header"
      >
        <div
          class="home-title"
          :style="{width:pageWidth+'px'}"
        >
          <div
            v-show="route.name!=='home'"
            class="title-back noDrag"
            @click="toBack"
          ><q-icon name="arrow_back"></q-icon> {{ $t('backHome') }}</div>
          <img
            class="title-logo"
            src="../assets/logo.ico"
            alt=""
            height="50"
          >
          <h5
            class="soft-title noDrag"
            @click="toHome"
          >{{$t("云任工具")}}</h5>

          <!-- <miSelect
            class="noDrag"
            v-model="lang"
            style="width:100px"
            :borderless="false"
            outlined
            :clearable="false"
            :use-input="false"
            hide-bottom-space
            @onchange="changeLang"
            :options="[
              {label:'中文',value:'zh'},
              {label:'English',value:'en'},
            ]"
          ></miSelect> -->
          <span
            @click="openPet"
            class="head-pet hover-back noDrag"
          >
            <img
              height="45"
              :src="toolsImg.pet"
              alt=""
            >
            <span>{{$t("deskpet")}}</span>
            <q-tooltip>
              {{$t("headPetTip")}}
            </q-tooltip>
          </span>
          <span
            style="margin-left:10px"
            class="noDrag"
          >
            <mi-button
              @click="openWebsite"
              color="secondary"
              :label="$t('website')"
            ></mi-button>
          </span>
          <div class="user-panel">
            <div
              v-if="!user.userName"
              class="noDrag"
            >
              <div class="login-title-box">
                <mi-button
                  :label="$t('login')"
                  flat
                  @click="openLoginPage('1')"
                ></mi-button>/<mi-button
                  :label="$t('register')"
                  flat
                  @click="openLoginPage('2')"
                ></mi-button>
              </div>
            </div>
            <div
              class="login-title-box login-title-user noDrag"
              v-else
            >
              <miButton
                @click="openQiandao"
                style="margin-right:15px"
                color="primary"
                :label="$t('qiandao')"
              ></miButton>
              <q-chip
                class="user-chip"
                text-color="#333"
              >
                <q-avatar><img
                    :src="user.avartar"
                    alt=""
                  ></q-avatar>
                {{user.nickName}}
                <q-popup-proxy
                  :offset="[20, 10]"
                  v-model="userPop"
                  transition-show="flip-up"
                  transition-hide="flip-down"
                >
                  <userPanel
                    @logout="logout"
                    @toPersonal="toPersonal"
                  ></userPanel>
                </q-popup-proxy>
              </q-chip>

            </div>
          </div>

          <div class="menu-panel noDrag">
            <div
              class="menu-item menu-down"
              @click="operateWin('5')"
            >
              <img
                height="20"
                :src="localImages.menuIcon"
                alt=""
              >
              <q-menu
                transition-show="slide-down"
                transition-duration="300"
              >
                <q-list>
                  <q-item
                    clickable
                    @click="toSetting"
                  >
                    {{$t("setting")}}
                  </q-item>
                  <q-item
                    clickable
                    @click="showVersion"
                  >
                    {{$t("version")}}
                  </q-item>
                </q-list>
              </q-menu>
            </div>
            <div
              class="menu-item min-size"
              @click="operateWin('1')"
            >
              <img
                height="20"
                :src="localImages.minSize"
                alt=""
              >
            </div>
            <div
              class="menu-item max-size"
              v-if="!isMaxWin"
              @click="operateWin('2')"
            >
              <img
                height="20"
                :src="localImages.Maximize"
                alt=""
              >
            </div>
            <div
              v-else
              class="menu-item remax-size"
              @click="operateWin('3')"
            >
              <img
                height="20"
                :src="localImages.Maximize_1"
                alt=""
              >
            </div>
            <div
              class="menu-item menu-close"
              @click="operateWin('4')"
            >
              <img
                height="20"
                :src="localImages.close"
                alt=""
              >
            </div>
          </div>
        </div>
      </q-header>

      <q-page-container style="padding-top:0;width:100%">
        <div
          v-if="userIsPass"
          class="page-container"
          :style="{width:'100%'}"
        >
          <keep-alive include="packageDownload">
            <router-view />
          </keep-alive>
        </div>
      </q-page-container>

      <!-- <miDialog
        height="570px"
        v-model="loginVisible"
      >
        <loginPage @close="closeLogin"></loginPage>
      </miDialog> -->
    </q-layout>

    <div
      class="loading-overlay"
      v-show="isShowbar"
    ></div>
    <q-spinner-puff
      class="spinner-audio"
      v-if="isShowbar"
      color="primary"
      size="80px"
    />
    <div
      class="pet-box"
      :style="{
        left:petPosition.left+'px',
        top:petPosition.top+'px',
        width:petWidth+'px',
        height:petHeight+'px'
      }"
      v-if="petBoxVisible"
    >
      <img
        class="pet-box-close"
        @click="petBoxVisible=false"
        src="../assets/images/common/close.svg"
        alt=""
      >
      <miButton
        style="margin-left:5px"
        v-if="!petVisible"
        :label="$t('loadPet')"
        @click="showPet"
      ></miButton>
      <pet
        :height="petHeight"
        :width="petWidth"
        :left="defaultPosition.left"
        :top="defaultPosition.top"
        @changePosition="changePosition"
        @setPosition="setPosition"
        v-if="petVisible"
      ></pet>
    </div>
    <miDialog
      v-model="qiandaoVisible"
      width="600px"
      height="400px"
    >
      <qiandaoDia></qiandaoDia>
    </miDialog>
    <miDialog
      v-model="versionVisible"
      width="600px"
      height="400px"
    >
      <div style="text-align:center">
        <img
          width="300"
          src="../assets/logo.ico"
          alt=""
        >
        <div style="font-size:24px">当前版本&nbsp;{{versionL}}</div>
      </div>
    </miDialog>
  </div>

</template>

<script setup>
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import miButton from "src/components/form/mi-button.vue"
import miDialog from "src/components/mi-dialog.vue"
import { useRoute, useRouter } from "vue-router"
import headBarsVue from './header-bars.vue'
import { useUserStore } from 'src/stores/user'
import userPanel from "./userPanel.vue"
import { useCommonStore } from 'src/stores/common'
import { useHttpStore } from 'src/stores/http'
import { config } from 'src/config'
import { tokenUser } from 'src/http/user'
import pet from "./pet.vue"
import { defaultPageWidth } from 'src/utils'
import qiandaoDia from "src/components/qiandao.vue"
import { getClientIP, getWeather } from 'src/http/common'
import miSelect from "src/components/form/mi-select.vue"
import { useI18n } from "vue-i18n"
import { localImages, toolsImg } from 'src/utils/images'
import labelValue from "../pages/components/labelValue.vue"
const { version } = window.api
const i18n = useI18n()
const versionVisible = ref(false)
const isMaxWin = ref(false)
const versionL = ref(version)
const headerBar = ref(null)
const petVisible = ref(false)
const petBoxVisible = ref(false)
const showHideBtn = ref(false)
const route = useRoute()
const lang = computed({
  get() {
    let v = localStorage.getItem("lang")
    if (!v) {
      const isChinese =
        navigator.language.toLowerCase() === "zh-cn" ||
        navigator.language.toLowerCase() === "zh";
      v = isChinese
        ? "zh"
        : "en";
    }
    return v
  },
  set(val) {
    localStorage.setItem("lang", val)
  }
})

const openPet = () => {
  window.api.sendMessage("openPet")
  gtag("event", "click", {
    event_category: "pet",
    event_label: "首页",
    value: 1,
  });
}

const openWebsite = () => {
  window.api.openInBrowser("https://www.yunren.online")
}

const userStore = useUserStore()

const pageWidth = ref(window.innerWidth >= defaultPageWidth ? defaultPageWidth : window.innerWidth)

const router = useRouter()
const toHome = () => {
  router.push({ path: "/" })
}

const toBack = () => {
  router.push({
    name: "home"
  })
}

const changeLang = (key) => {
  i18n.locale.value = key
  nextTick(() => {
    headerBar.value.barLineMove()
  })

}

const toSetting = () => {
  router.push({ name: "setting" })
}

const showVersion = () => {
  versionVisible.value = true
}

const operateWin = (type) => {
  const sendMessage = window.api.sendMessage
  switch (type) {
    case "1":
      sendMessage("min")
      break;
    case "2":
      sendMessage("max")
      break;
    case "3":
      sendMessage("resetWindow")
      break;
    case "4":
      sendMessage("closeApp")
      break;
  }
}
window.api.onReceiveMessage("change-max", (val) => {
  isMaxWin.value = val
})
const commonStore = useCommonStore()

const footerShow = computed({
  get() {
    return commonStore.footerShow
  },
})

const pageMain = ref(null)

const onSetFooterShow = () => {
  commonStore.onSetFooterShow()
}

const qiandaoVisible = ref(false)

const openQiandao = () => {
  qiandaoVisible.value = true
}

const petWidth = ref(185)
const petHeight = ref(230)

//鼠标按下时位置
const defaultPosition = ref({ left: window.innerWidth - petWidth.value, top: window.innerHeight - petHeight.value })

//当前位置
const petPosition = ref({ left: window.innerWidth - petWidth.value, top: window.innerHeight - petHeight.value })

//鼠标move
const changePosition = (left, top) => {
  petPosition.value.left = defaultPosition.value.left + left
  petPosition.value.top = defaultPosition.value.top + top
}

//鼠标up
const setPosition = (left, top) => {
  defaultPosition.value.left = left
  defaultPosition.value.top = top
}

const showPet = () => {
  petVisible.value = true
}

const common = useCommonStore()

const user = computed({
  get() {
    return userStore.user
  },
  set(val) {
    userStore.user = val
  }
})

const userPop = ref(false)

const loginVisible = computed({
  get() {
    return common.loginVisible
  },
  set(val) {
    common.loginVisible = val
  }
})

const openLoginPage = (type) => {
  if (type === "1") {
    router.push({ name: "login" })
  } else {
    router.push({ name: "register" })
  }
}

const logout = () => {
  userStore.logout()
  router.push({ path: "/" })
}

const toPersonal = () => {
  router.push({ name: "personalCenter" })
}

const closeLogin = () => {
  loginVisible.value = false
}

const httpStore = useHttpStore()
const isShowbar = ref(false)
watch(() => httpStore.isRequested, (nv) => {
  if (nv) {
    isShowbar.value = true
  } else {
    setTimeout(() => {
      isShowbar.value = false
    }, 500);
  }
}, {
  deep: true,
})

const userIsPass = ref(false)

onMounted(async () => {
  let user = JSON.parse(localStorage.getItem("_user"))
  let token = localStorage.getItem("token")
  if (user && token) {
    let res = await tokenUser({ token })
    if (res.code === 0) {
      let userStore = useUserStore()
      userStore.setUser(res.data)
      userStore.setIslogin(true)
    }
    userIsPass.value = true
  } else {
    userIsPass.value = true
  }

  window.addEventListener("resize", () => {
    if (defaultPosition.value.left >= window.innerWidth - petWidth.value) {
      defaultPosition.value.left = window.innerWidth - petWidth.value
      petPosition.value.left = window.innerWidth - petWidth.value
    }
    if (defaultPosition.value.top >= window.innerHeight - petHeight.value) {
      defaultPosition.value.top = window.innerHeight - petHeight.value
      petPosition.value.top = window.innerHeight - petHeight.value
    }
    if (pageWidth.value > window.innerWidth) {
      pageWidth.value = window.innerWidth
    } else {
      if (window.innerWidth < defaultPageWidth) {
        pageWidth.value = window.innerWidth
      } else {
        pageWidth.value = defaultPageWidth
      }
    }
  })
})
window.fs = window.api.fs
window.child_process = window.api.child_process
</script>

<style lang="scss" scoped>
.page-main {
  overflow: auto;
  margin-right: 6px;
  margin-top: 55px;
  height: calc(100vh - 60px);
  width: calc(100vw - 6px);
  position: relative;
  .page-header {
    position: fixed;
    display: flex;
    justify-content: center;
    background-color: rgba(242, 253, 250, 0.7);
    color: #333;
  }
  .soft-title {
    cursor: pointer;
  }
  .title-logo {
    border-radius: 50%;
  }
  .user-panel {
    margin-left: auto;
  }
  .menu-panel {
    display: flex;
    .menu-item {
      display: flex;
      align-items: center;
      margin-right: 15px;
      cursor: pointer;
      padding: 5px;
      transition: all 0.3s;
      margin-left: 5px;
      &:hover {
        background-color: rgba(200, 221, 219, 0.9);
      }
    }
    .menu-down {
      position: relative;
    }
  }
  .login-title-box {
    .user-chip {
      padding: 20px;
      cursor: pointer;
    }
  }
  .login-title-user {
    display: flex;
    align-items: center;
  }
  .home-title {
    display: flex;
    align-items: center;
    height: 50px;
    -webkit-app-region: drag;
    padding: 0 5px;
  }
  .main-box {
    min-height: auto !important;
    display: flex;
    justify-content: center;
  }
  .page-container {
  }
  .spinner-audio {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .loading-overlay {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: rgba(33, 33, 33, 0);
  }
  .pet-box {
    position: fixed;
    width: 175px;
    height: 220px;
    .pet-box-close {
      position: absolute;
      top: 0;
      left: -30px;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
      &:active {
        opacity: 0.9;
      }
    }
  }
}
.title-back {
  display: inline-block;
  cursor: pointer;
  font-size: 18px;
  margin-right: 10px;
  border-radius: 6px;
  padding: 6px;
  &:hover {
    background-color: var(--blue);
    color: #fff;
  }
}
.hover-back {
  &:hover {
    background-color: rgba(200, 221, 219, 0.9);
  }
}
.head-pet {
  cursor: pointer;
  margin-left: 5px;
  display: flex;
  align-items: center;
  padding: 0 5px;
}
::v-deep .q-item {
  align-items: center;
}
</style>