<template>
  <div class="feedback-page">
    <slot name="options"></slot>
    <miForm
      :formOption="formOption"
      :form="form"
      @onSubmit="onStart"
    >
      <div class="register-footer">
        <miButton
          type="submit"
          class="register-btn"
          :label="btnLabel"
        ></miButton>
      </div>
    </miForm>
    <div class="result-pannel">
      <labelValue
        class="result-box"
        :label="resLabel"
      ></labelValue>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import miButton from "src/components/form/mi-button.vue"
import { useRouter } from "vue-router";
import { defaultPageWidth, isNewDay, notify } from "src/utils";
import { useQuasar } from "quasar";
import miForm from "src/components/form/index.vue"
import { validEmail, validPhone } from "src/utils/formValids";
import labelValue from "./labelValue.vue"

const $q = useQuasar()
const router = useRouter()

const form = ref({})

const emit = defineEmits(["onStart"])

const props = defineProps({
  label: {
    type: String,
    default: $t("htmlText")
  },
  btnLabel: {
    type: String,
    default: $t("toXml")
  },
  resLabel: {
    type: String,
    default: ""
  },
  maxlength: {
    type: Number,
    default: 1000000
  }
})

const formOption = ref([
  {
    key: 'context',
    label: props.label,
    rules: [
      val => !!val || props.label + '不能为空',
    ],
    attrs: {
      maxlength: props.maxlength
    },
    type: "textarea",
    events: {},
    slot: '',
  },
])

const onStart = async () => {
  emit("onStart", form.value.context)
}

onMounted(() => {

})
</script>

<style lang="scss" scoped>
.feedback-page {
  padding-top: 25px;
  .register-footer {
    margin-top: 15px;
    text-align: center;
  }
  .result-box {
    margin-top: 25px;
    min-height: 300px;
    max-height: 500px;
  }
  .result-pannel {
    padding: 8px 16px;
  }
}
</style>
