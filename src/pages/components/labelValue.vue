<template>
  <div class="line">
    <div
      class="line-item line-item-title"
      v-show="title"
    >{{title}}</div>
    <div
      class="line-item line-item-label"
      :style="{backgroundColor:labelGrayBack?'#f9f9f9':''}"
    >{{label}}</div>
    <span
      class="copy-btn"
      @click="copyLabel"
    ><q-icon name="content_copy"></q-icon></span>
  </div>
</template>

<script setup>
import { notify } from "src/utils";

defineOptions({
  name: 'labelValue'
});

const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  label: {
    type: String,
    default: ""
  },
  labelGrayBack: {
    type: Boolean,
    default: false
  }
})

const copyLabel = async () => {
  try {
    // 将文本复制到剪贴板
    await navigator.clipboard.writeText(props.label);
    // 提示复制成功
    notify("复制成功")
  } catch (err) {
    // 处理复制失败的情况
    console.error('Failed to copy text: ', err);
  }
}

</script>

<style lang="scss" scoped>
.line {
  display: flex;
  border: 1px solid #e6e6e6;
  position: relative;
  .line-item {
    padding: 5px 10px;
    white-space: pre-wrap;
    overflow: auto;
  }
  .line-item-title {
    border-right: 1px solid #e6e6e6;
    width: 200px;
    background-color: #f3f3f3;
  }
  .line-item-label {
    width: 100%;
    &:hover {
      background-color: #e5f4ef;
    }
  }
  .copy-btn {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 5px;
  }
}
</style>