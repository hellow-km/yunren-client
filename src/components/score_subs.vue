<template>
  <div
    class="qiandao-page"
    :style="{width:qWidth+'px'}"
  >
    <dateShow
      @onClickToday="onClickToday"
      :markText="$t('signed')"
      :markDays="markDays"
      :minWidth="qWidth"
    >
      <template #markDay>
        <q-chip
          style="white-space: normal;"
          dense
          color="orange"
          text-color="white"
          icon-right="star"
        >
          签
        </q-chip>
      </template>
    </dateShow>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import dateShow from "src/components/date-show.vue"
import { getQiandaoHistory, getScore_subs, qiandao } from "src/http/score"
import { useUserStore } from "src/stores/user";
import { formatTime } from "src/utils";
const qiandaoData = ref([])
const userStore = useUserStore()

const getQiandaoData = async () => {
  let res = await getScore_subs({ uID: userStore.user.user_ID })
  markDays.value = res.data.map(item => {
    return formatTime(item.qd_date, "yyyy-MM-dd")
  })
}
const getQWidth = () => {
  qWidth.value = 500 > window.innerWidth ? window.innerWidth : 500
}

const qWidth = ref(0)

const markDays = ref([])

onMounted(() => {
  getQWidth()
  window.addEventListener("resize", () => {
    getQWidth()
  })
  getQiandaoData()
})
</script>

<style lang="scss" scoped>
.qiandao-page {
  min-height: 300px;
  position: relative;
  margin: 0 auto;
  .qiandao-page-footer {
    position: absolute;
    bottom: 15px;
    left: 25px;
    right: 25px;
  }
}
</style>