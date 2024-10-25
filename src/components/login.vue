<template>
  <div class="loginResigster-common">
    <div class="common-head">{{ $t('moreRights') }}</div>
    <miTabs
      v-model="tab"
      :tabs="tabs"
    ></miTabs>
    <div
      class="login-page"
      v-show="tab==='2'"
    >
      <formPage
        :formOption="formOption"
        :form="form"
        ref="formRef"
      ></formPage>
      <div class="login-footer">
        <miCheckbox
          class="remember-btn"
          v-model="isRememberPWD"
          :label="$t('rememberPassword')"
        ></miCheckbox>
        <miButton
          class="forget-btn"
          @click="toForgetPassword"
          :attrs="{flat:true}"
          :label="$t('forgotPassword')"
        ></miButton>
        <miButton
          class="login-btn"
          @click="onSubmit"
          :label="$t('login')"
        ></miButton>
      </div>
      <div class="page-tip">
        <miButton
          class="create-btn"
          @click="toRegister"
          :attrs="{flat:true}"
          :label="$t('createAccount')"
        ></miButton>
      </div>
    </div>

    <div class="other-logins">
      <div class="other-label">{{ $t('otherLoginMethods') }}</div>
      <div class="other-login-ways">
        <div
          class="login-ways-item"
          @click="getQQInfo"
        >
          <div>
            <img
              width="30"
              src="../assets/images/common/QQ.png"
              alt=""
            >
          </div>
          <span>QQ登录</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import formPage from "src/components/form/index.vue"
import miButton from "src/components/form/mi-button.vue"
import miTabs from "src/components/mi-tabs.vue"
import miCheckbox from "src/components/form/mi-checkbox.vue"
import { login } from "src/http"
import { useUserStore } from "src/stores/user"
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { getQQUser } from "src/http/common"
import { notify } from "src/utils"

const router = useRouter()
const formOption = ref([
  {
    key: 'userName',
    label: 'userName',
    rules: [
      val => !!val || $t('userNameNotEmpty')
    ],
    attrs: {},
    events: {},
    slot: '',
  },
  {
    key: 'userPWD',
    label: 'password',
    type: "password",
    isPwd: true,
    rules: [
      val => !!val || $t('passwordNotEmpty')
    ],
    attrs: {},
    events: {},
    slot: '',
  }
])

const getQQInfo = async () => {
  let res = await getQQUser()
  let qqRes = JSON.parse(res.data.result)
  console.log("Res", JSON.parse(res.data.result));
  notify(qqRes.msg, "warning")

}

const isRememberPWD = ref(false)

const tabs = [
  {
    name: "2",
    label: $t('passwordLogin')
  }
]

const emit = defineEmits(["close"])

const formRef = ref(null)

const user = useUserStore()

onMounted(() => {
  let userName = localStorage.getItem("userName")
  let userPWD = localStorage.getItem("userPWD")
  form.value.userName = userName
  form.value.userPWD = userPWD
  isRememberPWD.value = localStorage.getItem("isRememberPWD") ? true : false
  gtag("event", "view", {
    event_category: "登录",
    event_label: "进入",
    value: 1,
  });
})

const tab = ref("2")
const form = ref({})
const onSubmit = () => {
  formRef.value.formRef.validate().then(success => {
    if (success) {
      login(form.value).then(res => {
        if (res.code === 0) {
          localStorage.setItem("token", res.data.token);
          user.setUser(res.data.user)
          if (isRememberPWD.value) {
            localStorage.setItem("isRememberPWD", 1)
            localStorage.setItem("userName", form.value.userName)
            localStorage.setItem("userPWD", form.value.userPWD)
          } else {
            localStorage.setItem("userName", form.value.userName)
            localStorage.removeItem("isRememberPWD")
          }
          user.setIslogin(true)

          router.push({ name: "home" })
        }
      })
    }
  })
}

const toForgetPassword = () => {
  emit("close")
  router.push({ path: "/forgetPassword" })
}

const toRegister = () => {
  emit("close")
  router.push({ name: "register" })
}


</script>

<style lang="scss" scoped>
.loginResigster-common {
  padding: 20px 40px 30px 20px;
  box-sizing: border-box;
  width: 500px;
  margin: 0 auto;
  .common-head {
    text-align: center;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .login-page {
    .login-footer {
      position: relative;
      text-align: center;
      margin-top: 50px;
      .remember-btn {
        position: absolute;
        left: 10px;
        top: -10px;
        transform: translateY(-100%);
      }
      .forget-btn {
        position: absolute;
        right: 10px;
        top: -10px;
        transform: translateY(-100%);
      }
      .login-btn {
        width: 90%;
        height: 40px;
      }
    }
  }
  .other-logins {
    height: 50px;
    text-align: center;
    margin-top: 10px;
    .other-label {
      font-size: 14px;
    }
    .other-login-ways {
      margin-top: 10px;
      font-size: 12px;
      text-align: center;
      .login-ways-item {
        cursor: pointer;
      }
    }
  }
  .page-tip {
    display: flex;
    margin-top: 5px;
    .create-btn {
      margin-left: auto;
    }
  }
}
</style>
