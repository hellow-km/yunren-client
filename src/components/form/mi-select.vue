<template>
  <q-select
    dense
    use-input
    input-debounce="0"
    emit-value
    map-options
    clearable
    v-model="value"
    :options="typeof RoomOptions=='function'?RoomOptions():RoomOptions"
    @filter="filterFn"
    @update:model-value="change"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import pinyin from "src/boot/getPingyin";

const $q = useQuasar();

const emit = defineEmits(["update:modelValue", "onchange"]);

const props = defineProps({
  value: {
    type: String,
    default: "value",
  },
  label: {
    type: String,
    default: "label",
  },
  modelValue: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
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
const RoomOptions = ref(props.options);

const filterFn = (val, update) => {
  const options =
    typeof RoomOptions.value == "function"
      ? RoomOptions.value()
      : RoomOptions.value;
  if (val == "") {
    update(() => {
      RoomOptions.value = props.options;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    RoomOptions.value = options.filter((v) => {
      let py = pinyin.getCamelChars(v[props.label]).toLowerCase();
      return (
        py.indexOf(needle) > -1 ||
        v[props.label].toLowerCase().indexOf(needle) > -1
      );
    });
  });
};

const change = (key) => {
  const options =
    typeof RoomOptions.value == "function"
      ? RoomOptions.value()
      : RoomOptions.value;

  let findItem = options.find((item) => {
    return item[props.value] == key;
  });
  if (findItem) {
    emit("onchange", key, findItem[props.label], findItem);
  } else {
    emit("onchange", key, "", findItem);
  }
};
</script>

<style lang="less" scoped>
</style>
