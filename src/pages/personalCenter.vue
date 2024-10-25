<template>
  <div class="personal-center">
    <div
      class="left-panel"
      :style="{width:leftWidth}"
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
          <q-item-section>{{$t("personCard")}}</q-item-section>
        </q-item>

        <q-item
          @click="setTab('2')"
          clickable
          v-ripple
          :active="tab === '2'"
          active-class="menu-active"
        >
          <q-item-section>{{$t("myArticles")}}</q-item-section>
        </q-item>
      </q-list>
    </div>
    <div
      class="right-panel"
      :style="{paddingLeft:`calc(${leftWidth} + 20px )`}"
    >
      <personCard v-if="tab==='1'"></personCard>
      <myArticles v-if="tab==='2'"></myArticles>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "src/stores/user";
import { computed, onMounted, ref } from "vue";
import miButton from "src/components/form/mi-button.vue"
import { tokenUser, updateUser } from "src/http/user";
import { isLessWidth, notify } from "src/utils";
import { useRoute, useRouter } from "vue-router";
import personCard from "./components/personalCenter/personCard.vue"
import myArticles from "./components/personalCenter/myArticles.vue"
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
defineOptions({
  name: 'personalCenter'
});

const user = computed({
  get() {
    return userStore.user
  },
  set(val) {
    userStore.user = val
  }
})

const leftWidth = ref(isLessWidth() ? "100px" : "220px")


const tab = ref("1")

const setTab = (tabShow) => {
  router.push({
    name: "personalCenter",
    query: {
      tab: tabShow
    }
  })
  tab.value = tabShow
}

onMounted(() => {
  tab.value = route.query.tab || "1"
  window.addEventListener("resize", () => {
    leftWidth.value = isLessWidth() ? "100px" : "220px"
  })
})

</script>

<style lang="scss" scoped>
.personal-center {
  padding: 10px;
  display: flex;
  margin-top: 15px;
  .left-panel {
    position: fixed;
    background-color: #fff;
  }
  .right-panel {
    width: 100%;
    padding-left: 220px;
    padding-right: 15px;
  }
  .menu-active {
    background-color: var(--q-primary);
    color: #fff;
  }
}
</style>
