<template>
  <q-checkbox
    v-model="value"
    v-bind="attrs"
    v-on="events"
  />
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
    type: String,
    default: "",
  },
});

const value = ref("");
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
</script>

<style lang="less" scoped>
</style>
