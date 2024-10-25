<template>
  <miInput
    class="search-input"
    v-model="value"
    @keyup.enter="onSearch"
    outlined
    @blur="onSearch"
    :placeholder="$t(placeholder)"
  >
    <template v-slot:append>
      <miButton
        :label="$t('search')"
        @click="onSearch"
      >
      </miButton>
    </template>
  </miInput>
</template>

<script setup>
import miInput from "src/components/form/mi-input.vue"
import miButton from "src/components/form/mi-button.vue"
import { ref, watch } from "vue"

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  },
  placeholder: {
    type: String,
    default: "searchDefaultPlace"
  }
})

const emit = defineEmits(["update:modelValue", "onSearch"])

const onSearch = () => {
  emit("onSearch")
}

const value = ref("");

const qInputRef = ref(null);

defineExpose({ qInputRef });

watch(value, (nv, ov) => {
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