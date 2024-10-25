<template>
  <div class="line">
    <div class="line-item line-item-title">{{title}}</div>

    <div
      class="line-item line-item-label"
      :style="{backgroundColor:labelGrayBack?'#f9f9f9':''}"
    >{{modelValue}}</div>
    <q-popup-edit
      style="min-width:500px"
      v-model="editForm"
      v-slot="scope"
      auto-save
      buttons
      persistent
      :cover="false"
      :label-set="$t('confirm')"
      :label-cancel="$t('cancel')"
      self="top left"
      :offset="[-500,-100]"
      v-if="showEdit"
      @before-hide="saveEdit"
    >
      <miForm
        :formOption="formOption"
        :form="scope.value"
      ></miForm>
    </q-popup-edit>
    <span
      v-if="canEdit"
      class="copy-btn"
      @click="reEdit"
    ><q-icon name="edit_calendar"></q-icon></span>
  </div>
</template>

<script setup>
import { notify } from "src/utils";
import miForm from "src/components/form/index.vue"
import { ref, defineProps, watch, onMounted } from "vue";

defineOptions({
  name: 'labelValue'
});

const emit = defineEmits(["update:modelValue", "submit"])

const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  modelValue: {
    type: String,
    default: ""
  },
  labelGrayBack: {
    type: Boolean,
    default: false
  },
  canEdit: {
    type: Boolean,
    default: false
  },
  editOption: {
    type: Array,
    default: null
  },
})

const editForm = ref({})

// 在这里访问 props 中的 label
const formOption = props.editOption || [
  {
    key: 'value',
    label: '',
    rules: [
      (val) => {
        if (!val) {
          return props.label + $t('cannotNull')
        }
      },
    ],
    attrs: {},
    events: {},
    slot: '',
  }
]

const saveEdit = (value, iValue) => {
  if (props.modelValue != editForm.value.value) {
    emit("submit")
  }
  emit("update:modelValue", editForm.value.value)
  showEdit.value = false

}

onMounted(() => {
  editForm.value.value = props.modelValue
})

const showEdit = ref(false)

const reEdit = async () => {
  showEdit.value = true
}

</script>

<style lang="scss" scoped>
.line {
  display: flex;
  // border: 1px solid #e6e6e6;
  position: relative;
  .line-item {
    padding: 15px;
  }
  .line-item-title {
    width: calc(200 / 1080 * 100%);
  }
  .line-item-label {
    width: 100%;
  }
  .copy-btn {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>