<template>
  <span>
    <q-input
      filled
      v-model="value"
      :rules="['anyColor']"
      class="options-back-ipt"
      input-class="color-ipt"
      readonly
    >
      <template v-slot:append>
        <q-icon
          name="colorize"
          class="cursor-pointer"
        >
          <q-popup-proxy
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-color v-model="value" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
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
::v-deep.options-back-ipt {
  height: 40px;
  padding-bottom: 0;
  .q-field__control {
    height: 100%;
  }
  .q-field__append {
    height: 100%;
  }
}
</style>
