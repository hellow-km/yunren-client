<template>
  <q-linear-progress
    :animation-speed="50"
    dark
    stripe
    rounded
    size="20px"
    :value="Number(value)"
    color="secondary"
  >
    <div class="absolute-full flex flex-center">
      <q-badge
        color="white"
        text-color="secondary"
        :label="(value*100).toFixed(0)+'%'"
      />
    </div>
  </q-linear-progress>
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
