<template>
  <q-btn
    :label="label"
    :color="color"
    rounded
    v-bind="attrs"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
const emit = defineEmits(["update:modelValue", "onchange"]);

const props = defineProps({
  attrs: {
    type: Object,
    default: () => ({}),
  },
  label: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "primary",
  },
});
</script>

<style lang="less" scoped>
</style>
