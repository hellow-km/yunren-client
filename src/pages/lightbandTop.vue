<template>
  <div class="lightband-page">
    <div class="page-head">
      <selectbar
        v-model="currentBar"
        :list="barList"
        @change="changeBar"
      >
      </selectbar>
    </div>
    <div class="page-content">
      <div v-show="currentBar=='personalData'">
        <div class="race-options">
          <searchIpt
            class="race-opt-item"
            v-model="searchName"
            @search="onSearch"
            placeholder="请输入搜索的用户名"
          ></searchIpt>
        </div>
        <div class="echarts-page">
          <div class="fight-strong">

          </div>
          <div class="fight-number">

          </div>
        </div>
      </div>
      <div v-show="currentBar=='raceData'">
        <div class="race-options">
          <miSelect
            v-if="currentBar=='raceData'"
            class="race-opt-item race-select"
            :options="raceData"
            v-model="currentRace"
            :clearable="false"
            @onchange="onChange"
          ></miSelect>
        </div>
        <div class="echarts-page">
          <div class="fight-strong"></div>
          <div class="fight-number"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import searchIpt from "src/components/searchIpt.vue"
import selectbar from "src/components/select-bar.vue"
import miSelect from "src/components/form/mi-select.vue"
import { onMounted, ref } from "vue"
import { getLocalData, getRaceOfficeData } from "src/http/common"
import { useRoute, useRouter } from "vue-router"
import * as echarts from 'echarts';

// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));
const route = useRoute()
const router = useRouter()
const currentBar = ref("personalData")

const searchName = ref("")

const barList = ref([
  {
    title: "个人数据",
    path: "personalData"
  },
  {
    title: "赛季数据",
    path: "raceData"
  }
])

const currentRace = ref("summer2024")

const raceData = ref([
  {
    value: "summer2024",
    label: "夏季赛2024"
  },
  {
    value: "Spring2024",
    label: "春季赛2024"
  },
  {
    value: "newyear2024",
    label: "新年赛2024",
  },
  {
    value: "winter",
    label: "冬季赛2023",
  },
  {
    value: "autumn",
    label: "秋季赛2023",
  },
  {
    value: "summer",
    label: "夏季赛2023",
  },
  {
    value: "ss02",
    label: "春季赛20232.0",
  },
  {
    value: "ss",
    label: "春季赛2023",
  }
])

const changeBar = (item) => {
  // currentBar.value = item.path
  router.push({
    name: "lightbandTop",
    query: {
      tab: currentBar.value
    }
  })
}
const onSearch = () => {
  console.log("seach");
}

const onChange = (item) => {
  console.log("item", item);
}

const option = {
  xAxis: {
    max: 'dataMax'
  },
  yAxis: {
    type: 'category',
    data: ['A', 'B', 'C', 'D', 'E'],
  },
  series: [
    {
      realtimeSort: true,
      name: 'X',
      type: 'bar',
      data: data,
      label: {
        show: true,
        position: 'right',
        valueAnimation: true
      }
    }
  ],
  legend: {
    show: true
  },
  animationDuration: 0,
  animationDurationUpdate: 3000,
  animationEasing: 'linear',
  animationEasingUpdate: 'linear'
};

const getPersonalData = async () => {

}

const getEchartsData = () => {

}

onMounted(() => {
  if (route.query.tab) {
    currentBar.value = route.query.tab
  }
})

</script>

<style lang="scss" scoped>
.lightband-page {
  padding: 15px;
  .page-head {
    margin-top: 15px;
  }
  .page-content {
    .race-options {
      display: flex;
      justify-content: center;
      margin: 15px 0;
    }
    .race-select {
      width: 300px;
    }
    .race-opt-item {
      margin-left: 15px;
    }
  }
  .echarts-page {
    display: flex;
    justify-content: center;
    .fight-strong {
      width: 45%;
    }
    .fight-number {
      width: 45%;
      margin-left: 5%;
    }
  }
}
</style>