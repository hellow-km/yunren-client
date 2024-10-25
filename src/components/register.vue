<template>
  <div class="register-box">
    <miTabs
      class="register-tab"
      v-model="tab"
      :tabs="tabs"
    ></miTabs>
    <div
      class="register-page"
      v-if="tab==='1'"
    >
      <formPage
        :formOption="formOption"
        :form="form"
        @onSubmit="onSubmit"
      >
        <div class="register-footer">
          <miButton
            type="submit"
            class="register-btn"
            :label="$t('register')"
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
import { nextTick, onMounted, ref } from "vue"
import { validEmail, validPassword } from "../utils/formValids"
import { getEmailCode } from "../http/common"
import { notify } from "src/utils"
import { register } from "../http/index"
import { useRoute, useRouter } from "vue-router"
import { useCommonStore } from "src/stores/common"
const router = useRouter()
const common = useCommonStore()
const formOption = ref([
  {
    key: 'userName',
    label: 'userName',
    rules: [
      val => !!val || $t('userNameRequired'),
    ],
    attrs: {},
    events: {},
    slot: '',
  },
  {
    key: 'nickName',
    label: 'nickname',
    rules: [
      val => !!val || $t('nickNameRequired'),
    ],
    attrs: {},
    events: {},
    slot: '',
  },
  {
    key: 'userPWD',
    label: 'password',
    showStrength: true,
    type: "password",
    isPwd: true,
    rules: [
      val => !!val || $t('passwordRequired'),
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
    label: 'confirmPassword',
    type: "password",
    isPwd: true,
    rules: [
      (val) => {
        return form.value.rePWD == form.value.userPWD ? null : $t('passwordMismatch')
      }
    ],
    attrs: {},
    events: {

    },
    slot: '',
  },
  {
    key: 'email',
    label: 'email',
    rules: [
      val => !!val || $t('emailRequired'),
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
      val => !!val || $t('emailCodeRequired'),
    ],
    attrs: {},
    events: {
      sendCode: async () => {
        if (!form.value.email) {
          notify($t('emailRequired'), "warning")
          return Promise.reject()
        }
        if (validEmail(form.value.email)) {
          notify($t('emailInvalid'), "warning")
          return Promise.reject()
        }
        let res = await getEmailCode({ email: form.value.email })
        if (res.code === 0) {
          notify($t('emailSendSuccess'))
        }
      }
    },
    slot: '',
  },
])

const flagSend = ref(false)

const tabs = [
  {
    name: "1",
    label: $t('emailRegisterLabel')
  },
  // {
  //   name: "2",
  //   label: "手机号注册"
  // },
]

const tab = ref("1")
const form = ref({})
const onSubmit = () => {
  register(form.value).then(res => {
    if (res.code === 0) {
      notify($t('registerSuccess'))
      router.push({ path: "/" })
      nextTick(() => {
        common.loginVisible = true
      })
    }
  })
}

onMounted(() => {
  try {
    gtag("event", "view", {
      event_category: "注册",
      event_label: "进入",
      value: 1,
    });
  } catch (e) { }

})
</script>

<style lang="scss" scoped>
.register-box {
  width: 500px;
  height: 100vh;
  margin: 0 auto;
  .register-tab {
    margin-bottom: 30px;
  }
  .register-page {
    .register-footer {
      position: relative;
      text-align: center;
      margin-top: 0;
      .forget-btn {
        position: absolute;
        right: 10px;
        top: -10px;
        transform: translateY(-100%);
      }
      .register-btn {
        width: 90%;
        height: 40px;
      }
    }
  }
}
</style>
