<template>
  <div class="weather-page">
    <div class="weather-icon">
      <i :class="'qi-'+nowWeather.icon"></i>
    </div>
    <div lass="weather-desc">
      <span>{{nowWeather.cityName}}</span>
      <span style="margin-left:10px">{{nowWeather.text||""}}</span>
      <span style="margin-left:10px">{{nowWeather.temp?nowWeather.temp+'℃':''}}</span>
    </div>
  </div>
</template>

<script setup>
import { getClientIP, getClientIPSimple, getWeather } from "src/http/common"
import { useCommonStore } from "src/stores/common"
import { onMounted, ref } from "vue"
import "./weatherFont/qweather-icons.css"

const common = useCommonStore()

const nowWeather = ref({})

onMounted(async () => {
  if (window.location.origin.indexOf("yunren.online") > -1) {
    let res = await getClientIPSimple({})
    let result = JSON.parse(res.data.result)
    const longitude = result.loc.split(",")[1]
    const latitude = result.loc.split(",")[0]
    common.IP = result.ip
    //108.3166732788086,22.816669464111328
    let wRes = await getWeather("a888ecf284ec4a7c90b7333ec604959b", `${longitude},${latitude}`)
    let wData = wRes.data
    if (wData.code == 402) {

    } else if (wData.code == 200) {
      nowWeather.value = wData.now
      nowWeather.cityName = location.city.name_translated
    }
  }
})
</script>

<style lang="scss" scoped>
.weather-page {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
  .weather-icon {
    width: 100%;
    text-align: center;
    i {
      font-size: 40px;
      color: blue;
    }
  }
  .weather-desc {
    display: flex;
  }
}
</style>
