<template>
  <div class="forgetPassword-box">
    <miTabs
      class="forgetPassword-tab"
      v-model="tab"
      :tabs="tabs"
    ></miTabs>
    <div
      class="forgetPassword-page"
      v-if="tab==='1'"
    >
      <formPage
        :formOption="formOption"
        :form="form"
        @onSubmit="onSubmit"
      >
        <div class="forgetPassword-footer">
          <miButton
            type="submit"
            class="forgetPassword-btn"
            :label="$t('resetPassword')"
          ></miButton>
        </div>
      </formPage>
    </div>
  </div>
</template>

<script setup>
import formPage from "src/components/form/index.vue"
import miButton from "src/components/form/mi-button.vue"
import miTabs from "src/components/mi-tabs.vue"
import { ref } from "vue"
import { validEmail, validPassword } from "../utils/formValids"
import { getEmailCode } from "src/http/common"
import { notify } from "src/utils"
import { resetPassword } from "src/http/user"
import { useRouter } from "vue-router"
const router = useRouter()
const formOption = ref([
  {
    key: 'userName',
    label: 'userName',
    rules: [
      val => !!val || $t('userNameEmpty'),
    ],
    attrs: {},
    events: {},
    slot: '',
  },
  {
    key: 'email',
    label: 'email',
    rules: [
      val => !!val || $t('emailEmpty'),
      val => validEmail(val)
    ],
    attrs: {},
    events: {},
    slot: '',
  },
  {
    key: 'emailCode',
    type: "code",
    label: 'emailCode',
    rules: [
      val => !!val || $t('emailCodeEmpty'),
    ],
    attrs: {},
    events: {
      sendCode: async () => {
        if (!form.value.email) {
          notify($t('emailEmpty'), "warning")
          return Promise.reject()
        }
        if (validEmail(form.value.email)) {
          notify($t('emailInvalid'), "warning")
          return Promise.reject()
        }
        let res = await getEmailCode({ email: form.value.email, type: "2" })
        if (res.code === 0) {
          notify($t('sendSuccess'))
        }
      }
    },
    slot: '',
  },
  {
    key: 'userPWD',
    label: 'password',
    showStrength: true,
    type: "password",
    isPwd: true,
    rules: [
      val => !!val || $t('passwordEmpty'),
      (val) => {
        return validPassword(val)
      },

    ],
    attrs: {},
    events: {},
    slot: '',
  },
  {
    key: 'rePWD',
    label: 'repassword',
    type: "password",
    isPwd: true,
    rules: [
      (val) => {
        return form.value.rePWD == form.value.userPWD ? null : $t('repasswordMismatch')
      }
    ],
    attrs: {},
    events: {

    },
    slot: '',
  },

])

const flagSend = ref(false)

const tabs = [
  {
    name: "1",
    label: $t('forgetPassword')
  },
  // {
  //   name: "2",
  //   label: "手机号注册"
  // },
]

const tab = ref("1")
const form = ref({})
const onSubmit = () => {
  resetPassword(form.value).then(res => {
    if (res.code === 0) {
      notify($t('resetSuccess'))
      router.push({ path: "/" })
    }
  })
}
</script>

<style lang="scss" scoped>
.forgetPassword-box {
  width: 500px;
  margin: 20px auto;
  .forgetPassword-tab {
    margin-bottom: 30px;
  }
  .forgetPassword-page {
    .forgetPassword-footer {
      position: relative;
      text-align: center;
      margin-top: 50px;
      .forget-btn {
        position: absolute;
        right: 10px;
        top: -10px;
        transform: translateY(-100%);
      }
      .forgetPassword-btn {
        width: 90%;
        height: 40px;
      }
    }
  }
}
</style>
