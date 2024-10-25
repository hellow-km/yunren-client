<template>
  <div class="emoji-list">
    <span
      class="emoji-item"
      v-for="(item) in emojis"
      :key="item"
      @click="onSelectEmoji(item)"
    >{{item}}</span>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  emojis: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(["onSelect"])

const onSelectEmoji = (item) => {
  emit("onSelect", item)
}

</script>

<style lang="scss" scoped>
.emoji-list {
  display: flex;
  flex-wrap: wrap;
  .emoji-item {
    font-size: 30px;
    line-height: unset;
    width: 42px;
    height: 42px;
    letter-spacing: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-sizing: border-box;
    &:hover {
      border: 1px solid #eee;
    }
  }
}
.text-body2 {
  line-height: unset;
  letter-spacing: unset;
}
</style>