<template>
  <div class="content-item">
    <div>
      <div class="content-item-img">
        <img
          :src="img"
          alt=""
        >
      </div>
      <div class="content-item-title">
        <div>{{label}}</div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  img: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.content-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  box-shadow: 5px 5px 10px rgba(155, 155, 155, 0.3);
  width: 300px;
  height: 200px;
  padding: 10px;
  margin: 25px;
  margin-left: 0;
  cursor: pointer;
  &:hover {
    box-shadow: 5px 5px 10px rgba(155, 155, 155, 0.5);
    .content-item-title {
      color: #0caef9;
    }
  }
  .content-item-img {
    text-align: center;
    img {
      width: 50%;
    }
  }
  .content-item-title {
    color: #333;
    margin-top: 10px;
    font-size: 22px;
    text-align: center;
  }
}
</style>
