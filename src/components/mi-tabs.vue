<template>
  <q-tabs
    v-model="value"
    inline-label
    active-color="primary"
    indicator-color="primary"
    v-bind="{...attrs}"
  >
    <q-tab
      v-for="item in tabs"
      :key="item.name"
      :name="item.name"
      :label="item.label"
    />
  </q-tabs>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
const emit = defineEmits(["update:modelValue", "onchange"]);

const props = defineProps({
  attrs: {
    type: Object,
    default: () => ({}),
  },
  tabs: {
    type: Array,
    default: () => ([]),
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

<style lang="scss" scoped>
</style>
