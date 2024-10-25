<template>
  <div class="setting-panel">
    <div
      class="left-panel"
      :style="{width:'200px'}"
    >
      <q-list
        bordered
        separator
      >
        <q-item
          @click="setTab('1')"
          clickable
          v-ripple
          :active="tab === '1'"
          active-class="menu-active"
        >
          <q-item-section>{{$t("basicSetting")}}</q-item-section>
        </q-item>
      </q-list>
    </div>
    <div
      class="right-panel"
      :style="{paddingLeft:`220px`}"
    >
      <q-card class="right-panel-card">
        <div class="option-item">
          <label
            for=""
            class="option-item-left"
          >{{$t("Language")}}</label>
          <miSelect
            class="option-item-right"
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
          ></miSelect>
        </div>

        <div class="option-item">
          <span class="option-item-left">{{$t("Pet setting")}}</span>
          <div class="option-item-right">
            <miButton
              :label="$t('模型和动作管理')"
              @click="modelAndActionVisible=true"
            ></miButton>
          </div>
        </div>
      </q-card>
    </div>
    <miDialog
      width="85vw"
      height="85vh"
      v-model="modelAndActionVisible"
    >
      <modelAndAction></modelAndAction>
    </miDialog>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import miSelect from "src/components/form/mi-select.vue"
import miButton from "src/components/form/mi-button.vue"
import miDialog from "src/components/mi-dialog.vue"
import modelAndAction from "./components/modelAndAction.vue"
import { useI18n } from "vue-i18n"

const i18n = useI18n()

const modelAndActionVisible = ref(false)

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

const changeLang = (key) => {
  i18n.locale.value = key
}

const tab = ref("1")
</script>

<style lang="scss" scoped>
.setting-panel {
  padding: 10px;
  display: flex;
  margin-top: 15px;
  .left-panel {
    position: fixed;
    background-color: #fff;
  }
  .right-panel {
    width: 100%;
    height: 80vh;
    padding-left: 220px;
    padding-right: 15px;
    .right-panel-card {
      width: 100%;
      height: 100%;
      padding: 25px 20px;
      .option-item {
        margin-bottom: 20px;
        display: flex;
        .option-item-right {
          margin-left: 20px;
        }
      }
    }
  }
  .menu-active {
    background-color: var(--q-primary);
    color: #fff;
  }
}
</style>