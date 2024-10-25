<template>
  <div class="feedback-page">
    <miForm
      :formOption="formOption"
      :form="form"
      @onSubmit="onFeedback"
    >
      <div class="register-footer">
        <miButton
          type="submit"
          class="register-btn"
          :label="$t('submit')"
        ></miButton>
      </div>
    </miForm>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import miButton from "src/components/form/mi-button.vue"
import { useRouter } from "vue-router";
import { getArticles } from "src/http/article";
import { defaultPageWidth, isNewDay, notify } from "src/utils";
import { useUserStore } from "src/stores/user";
import { useCommonStore } from "src/stores/common";
import { useQuasar } from "quasar";
import { feedback } from "src/http/common";
import miForm from "src/components/form/index.vue"
import { validEmail, validPhone } from "src/utils/formValids";

const $q = useQuasar()
const router = useRouter()
const userStore = useUserStore()
const common = useCommonStore()

const form = ref({})

const formOption = ref([
  {
    key: 'context',
    label: 'feedback',
    rules: [
      val => !!val || $t('feedbackEmpty'),
    ],
    attrs: {},
    type: "textarea",
    events: {},
    slot: '',
  },
  {
    key: 'emailOrPhone',
    label: 'emailOrPhone',
    rules: [
      val => !!val || $t('emailOrPhoneEmpty'),
      val => {
        let eText = validEmail(val)
        let fText = validPhone(val)
        if (!eText || !fText) {
          return
        } else {
          return eText || fText
        }
      }
    ],
    attrs: {},
    events: {},
    slot: '',
  },
])


const onFeedback = async () => {
  let res = await feedback(form.value)
  if (res.code === 0) {
    notify($t("feedbackSuccess"))
  }
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
}
</style>
