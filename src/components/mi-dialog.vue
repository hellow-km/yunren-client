<template>
  <q-dialog
    v-model="value"
    v-bind="{
      persistent:true,'auto-close':false, 
      'transition-show':'rotate','no-shake':true, 'transition-hide':'rotate',...attrs
    }"
    v-on="events || {}"
  >
    <div class="dia-page">
      <div class="dia-title">
        <span
          v-close-popup
          class="close-btn"
        >
          <img
            width="20"
            height="20"
            src="../assets/images/common/close.svg"
            alt=""
          ></span>
      </div>
      <q-card
        class="dia-card"
        :style="{
          width:width,
          height:height,maxWidth:'100%',
          overflowX:showXScroll?'auto':'hidden'
        }"
      >
        <slot></slot>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
const emit = defineEmits(["update:modelValue", "onchange"]);

const props = defineProps({
  events: {
    type: Object,
    default: () => ({}),
  },
  attrs: {
    type: Object,
    default: () => ({}),
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: "414px",
  },
  height: {
    type: String,
    default: "500px",
  },
  showXScroll: {
    type: Boolean,
    default: false,
  },
});
const getWidth = (str) => {
  return parseInt(str) > window.innerWidth ? window.innerWidth : parseInt(str);
};

const diaWidth = ref(getWidth(props.width));

const value = ref(false);
watch(
  () => props.modelValue,
  (nv) => {
    value.value = nv;
  },
  { deep: true, immediate: true }
);

watch(value, (nv) => {
  emit("update:modelValue", nv);
});

onMounted(() => {
  window.addEventListener("resize", () => {
    diaWidth.value = getWidth(props.width);
  });
});
</script>

<style lang="scss" scoped>
.dia-page {
  overflow: hidden;
  position: relative;
  max-width: unset;
  .dia-title {
    position: relative;
    height: 40px;
    background-color: #f7f7fc;
    .close-btn {
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 10px;
      &:hover {
        opacity: 0.7;
      }
      &:active {
        opacity: 0.9;
      }
    }
  }
  .dia-card {
    overflow: hidden;
    overflow-y: auto;
    border-radius: 0;
  }
}
</style>
