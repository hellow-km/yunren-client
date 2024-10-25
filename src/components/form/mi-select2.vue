<template>
  <q-select
    class="title-select"
    outlined
    :options="typeof f_selectAreas=='function'?f_selectAreas():f_selectAreas"
    :model-value="value"
    @blur="blurArea"
    @update:model-value="(e) =>change(e)"
    dense
    @clear="clearSelect"
    use-input
    new-value-mode="add"
    input-debounce="0"
    emit-value
    ref="PressSelect"
    map-options
    clearable
    @filter="filterFn"
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

const RoomOptions = ref(props.options);

const PressSelect = ref(null);

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

const change = (key) => {
  value.value = key;
  pushValue.value = {};
  const options =
    typeof props.options == "function" ? props.options() : props.options;

  let findItem = options.find((item) => {
    return item[props.value] == key;
  });
  if (key) {
    if (findItem) {
      emit("onchange", key, findItem[props.label], findItem);
    } else {
      emit("onchange", key, "", findItem);
    }
  }
};

const f_selectAreas = ref([]);

watch(
  () => props.options,
  (nv) => {
    f_selectAreas.value = nv;
  },
  { deep: true }
);

const pushValue = ref({});

const blurArea = () => {
  // if (pushValue.value.label) {
  //   value.value = pushValue.value.label;
  // }
  // change(value.value);
  value.value = "";
  change("");
};

const selectAreaModel = ref({});

const clearSelect = () => {
  pushValue.value = {};
  value.value = "";
  change(value.value);
};

const filterFn = (val, update) => {
  const options =
    typeof props.options == "function" ? props.options() : props.options;
  if (val == "") {
    update(() => {
      f_selectAreas.value = JSON.parse(JSON.stringify(options));
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    value.value = "";
    f_selectAreas.value = options.filter((v) => {
      return (
        v.label.toLowerCase().indexOf(needle) > -1 ||
        pinyin.getCamelChars(v.label).toLowerCase().indexOf(needle) > -1
      );
    });
    if (val) {
      const newItem = {
        label: val,
        value: val,
      };
      let fItem = options.find((v) => {
        return v.label.toLowerCase() == needle;
      });
      if (!fItem) {
        f_selectAreas.value.push(newItem);
        pushValue.value = newItem;
      } else {
        pushValue.value = fItem;
      }
    }
  });
};
</script>

<style lang="less" scoped>
</style>
