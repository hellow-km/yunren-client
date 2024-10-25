<template>
  <div>
    <div class="record-menu">
      <div
        class="record-item"
        v-for="item in menuList"
        :key="item.name"
        @click="item.click(item)"
      >
        <img
          :src="item.icon"
          alt=""
        >
        <q-tooltip>
          {{item.name}}
        </q-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { recordBtn } from "src/utils/images";
import { ref } from "vue";

const isPlated = ref(false)
const PlayState = {
  play: 1,
  pause: 2,
  stop: 3
}
const menuList = ref([
  {
    name: '开始录制',
    icon: recordBtn.play,
    state: PlayState.play,
    disabled: false,
  },
  {
    name: '暂停录制',
    icon: recordBtn.pause,
    state: PlayState.pause,
    disabled: true,
  },
  {
    name: '停止录制',
    icon: recordBtn.stop,
    state: PlayState.stop,
    disabled: true,
  }
])
const state = ref(PlayState.stop)

const clickItem = (item) => {
  state.value = item.state
}
</script>

<style lang="scss" scoped>
.record-menu {
  display: flex;
  img {
    width: 30px;
    margin-right: 10px;
  }
}
</style>