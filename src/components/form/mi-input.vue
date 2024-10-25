<template>
  <q-input
    v-model="value"
    @update:model-value="emit('onChange')"
    v-bind="attrs"
    ref="qInputRef"
    :type="type"
    :outlined="border"
  >
    <template v-slot:append>
      <slot name="append"></slot>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
const emit = defineEmits(["update:modelValue", "onChange"]);

const props = defineProps({
  attrs: {
    type: Object,
    default: () => ({}),
  },
  modelValue: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  border: {
    type: Boolean,
    default: false,
  },
});
const value = ref("");

const qInputRef = ref(null);

defineExpose({ qInputRef });

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
