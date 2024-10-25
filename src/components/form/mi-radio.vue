<template>
  <span>
    <q-radio
      v-for="itemR in data || []"
      v-model="value"
      :val="itemR.value"
      :label="itemR.label"
      v-bind="attrs"
      v-on="events || {}"
      :key="itemR.ID"
    />
  </span>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
const emit = defineEmits(["update:modelValue", "onchange"]);

const props = defineProps({
  data: {
    type: Object,
    default: () => [],
  },
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

watch(value, (nv) => {
  emit("update:modelValue", nv);
});
watch(
  () => props.modelValue,
  (nv) => {
    value.value = nv;
  },
  { deep: true, immediate: true }
);
</script>

<style lang="less" scoped>
</style>
